'use client';
// zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { answerQuestionSchema } from '@/lib/zod/schemas/answer-question-schema';

import { UserRecord } from '@/types/User';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { RoadmapUserQuestions } from '@/types/Roadmap';
import { answerRoadmapQueston } from '@/actions/roadmap/questions/answer-roadmap-question';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import QuestionHintAccordion from '@/components/questions/single/question-hint';

type SchemaProps = z.infer<typeof answerQuestionSchema>;

type AnswerQuestionFormProps = {
  userData: UserRecord;
  question: RoadmapUserQuestions;
  roadmapUid: string;
};

const RoadmapAnswerQuestionForm = forwardRef(function RoadmapAnswerQuestionForm(
  { userData, question, roadmapUid }: AnswerQuestionFormProps,
  ref: React.Ref<{ submitForm: () => void }>
) {
  const router = useRouter();

  const [newUserData, setNewUserData] = useState<UserRecord | null>(null);

  const form = useForm<SchemaProps>({
    resolver: zodResolver(answerQuestionSchema),
    defaultValues: {
      answer: '',
    },
  });

  // Expose the `submitForm` method to the parent via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(async (values) => {
        console.log('Submitting form with values:', values);
        await handleAnswerQuestion(values);
      })();
    },
  }));

  const handleAnswerQuestion = async (values: SchemaProps) => {
    console.log('Submitting form with values:', values);
    if (!userData) {
      console.error('User is not logged in');
      return;
    }

    try {
      const opts: any = {
        questionUid: question?.uid,
        answerUid: values.answer,
        roadmapUid,
        userUid: userData.uid,
        currentQuestionIndex: question?.order,
      };

      // there is a chance nothing get's returned as we perform a redirect
      // if this is the last question to answer
      const { userAnswer, nextQuestion } = await answerRoadmapQueston(opts);

      // if there is no next question, redirect to the roadmap page
      // TODO: show a completion message
      if (!nextQuestion) {
        router.push(`/roadmap/${roadmapUid}`);
        return;
      }

      // redirect to the page
      router.push(`/roadmap/${roadmapUid}/${nextQuestion?.uid}`);

      setNewUserData(newUserData);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Error submitting answer');
    }
  };

  return (
    <Form {...form}>
      <form
        className="font-satoshi flex flex-col"
        onSubmit={form.handleSubmit(handleAnswerQuestion)}
      >
        <div className="grid grid-cols-12 gap-4 p-4">
          {question?.answers?.map((answer) => (
            <div key={answer.uid} className="col-span-full">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormControl>
                    <Label
                      htmlFor={answer.uid}
                      className={cn(
                        'p-4 rounded-xl min-h-20 w-full h-full flex items-center gap-x-2 cursor-pointer transition-colors border border-black-50',
                        field.value === answer.uid
                          ? 'bg-black-50'
                          : 'bg-black hover:bg-black-75'
                      )}
                      onClick={() => field.onChange(answer.uid)}
                    >
                      <input
                        type="radio"
                        id={answer.uid}
                        className="hidden"
                        name="answer"
                        value={answer.uid}
                        checked={field.value === answer.uid}
                        onChange={() => {}}
                      />
                      <div
                        className={cn(
                          'size-5 rounded-md border border-black-50 flex items-center justify-center flex-shrink-0', // Fixed size and prevent shrinking
                          field.value === answer.uid
                            ? 'bg-accent text-white'
                            : ''
                        )}
                      >
                        {field.value === answer.uid && (
                          <Check className="h-3 w-3 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm">{answer.answer}</p>
                    </Label>
                  </FormControl>
                )}
              />
            </div>
          ))}
        </div>
        <Separator className="bg-black-50" />
        <div className="w-full space-y-4 px-4">
          {question.hint && <QuestionHintAccordion hint={question.hint} />}
        </div>
      </form>
    </Form>
  );
});

export default RoadmapAnswerQuestionForm;
