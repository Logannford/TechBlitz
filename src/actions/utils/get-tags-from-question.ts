import type { Question, QuestionWithoutAnswers } from '@/types/Questions';

export const getTagsFromQuestion = (
  questions: Question | Omit<Question, 'answers'>[]
) => {
  if (!questions) return [];

  const processQuestion = (question: Question | QuestionWithoutAnswers) => ({
    ...question,
    tags: question.tags?.map((tag) => ({
      questionId: tag.questionId,
      tagId: tag.tagId,
      tag: {
        uid: tag.tagId,
        name: tag.tag.name,
      },
    })),
  });

  // Check if `questions` is an array or a single object
  return Array.isArray(questions)
    ? questions.map(processQuestion)
    : processQuestion(questions);
};
