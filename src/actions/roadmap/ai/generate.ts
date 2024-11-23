'use server';
import { prisma } from '@/utils/prisma';
import { openai } from '@/lib/open-ai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { generateDataForAi } from './get-question-data-for-gen';
import { aiQuestionSchema } from '@/lib/zod/schemas/ai/response';
import { addUidsToResponse } from './utils/add-uids-to-response';
import { addOrderToResponseQuestions } from './utils/add-order-to-response-questions';

export const roadmapGenerate = async (opts: {
  roadmapUid: string;
  userUid: string;
}) => {
  // Retrieve and format the necessary data for AI
  const formattedData = await generateDataForAi(opts);

  if (formattedData === 'generated') {
    return await prisma.roadmapUserQuestions.findMany({
      where: {
        roadmapUid: opts.roadmapUid,
      },
      include: {
        RoadmapUserQuestionsAnswers: true,
      },
    });
  }

  // Request AI-generated questions
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      {
        role: 'system',
        content: `You're an expert software developer. Given a series of user-answered questions with results, generate a 10-question roadmap to enhance the user’s knowledge. Focus on areas the user got wrong, build on prior questions, and guide their next steps. Each question should have 4 answers (1 correct).`,
      },
      {
        role: 'system',
        content: `The code snippet that you provide needs to be wrapped in a pre tag and a code tag and be put in the 'codeSnippet' field.`,
      },
      {
        role: 'user',
        content: JSON.stringify(formattedData),
      },
    ],
    response_format: zodResponseFormat(aiQuestionSchema, 'event'),
    temperature: 0,
  });

  if (!res.choices[0]?.message?.content) {
    return 'invalid';
  }

  // Parse and process the AI response
  const formattedResponse = JSON.parse(res.choices[0].message.content);
  const questions = addUidsToResponse(formattedResponse.questionData);

  // add a order value to each question
  const questionsWithOrder = addOrderToResponseQuestions(questions);

  // Prepare database operations in a transaction
  const roadmapQuestionsData = questionsWithOrder.map((question: any) => ({
    uid: question.uid,
    roadmapUid: opts.roadmapUid,
    question: question.questions,
    correctAnswerUid: question.correctAnswerUid,
    codeSnippet: question.codeSnippet,
    hint: question.hint,
    completed: false,
    order: question.order,
    RoadmapUserQuestionsAnswers: {
      create: question.answers.map((answer: any) => ({
        answer: answer.answer,
        correct: answer.correct,
        uid: answer.uid,
      })),
    },
  }));

  try {
    await prisma.$transaction([
      prisma.roadmapUserQuestions.createMany({
        data: roadmapQuestionsData.map(
          ({ RoadmapUserQuestionsAnswers, ...rest }) => rest
        ),
      }),
      ...roadmapQuestionsData.flatMap((question) =>
        question.RoadmapUserQuestionsAnswers.create.map((answer: any) =>
          prisma.roadmapUserQuestionsAnswers.create({
            data: {
              ...answer,
              questionUid: question.uid,
              uid: answer.uid,
            },
          })
        )
      ),
      prisma.userRoadmaps.update({
        where: {
          uid: opts.roadmapUid,
        },
        data: {
          hasGeneratedRoadmap: true,
        },
      }),
    ]);

    // now go and get the questions to display
    const questions = await prisma.roadmapUserQuestions.findMany({
      where: {
        roadmapUid: opts.roadmapUid,
      },
      include: {
        RoadmapUserQuestionsAnswers: true,
      },
    });

    return questions;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Roadmap generation failed.');
  }
};