import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Question } from '@/types/Questions';
import type { UserRecord } from '@/types/User';
import type { Answer } from '@/types/Answers';
import LoadingSpinner from '@/components/ui/loading';
import { convertSecondsToTime } from '@/utils/time';
import JsonDisplay from '../../global/json-display';
import { LockClosedIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getRandomQuestion } from '@/actions/questions/get-next-question';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mantine/dates';
import { getUserDailyStats } from '@/actions/user/get-daily-streak';

type AnswerQuestionModalProps = {
  question: Question;
  user: UserRecord;
  correct: 'correct' | 'incorrect' | 'init';
  userAnswer: Answer;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry?: () => void;
  onNext?: () => void;
  nextQuestion?: string;
};

type DialogContentType = {
  correct: (name: string) => {
    heading: string;
    description: string;
  };
  incorrect: {
    heading: string;
    description: string;
  };
};

const dialogContent: DialogContentType = {
  correct: (name: string) => ({
    heading: `Well done ${name || 'there'}!`,
    description: 'Correct answer',
  }),
  incorrect: {
    heading: 'Better luck next time!',
    description: 'You got the answer wrong, want to try again?',
  },
};

export default function AnswerQuestionModal({
  question,
  user,
  correct,
  userAnswer,
  isOpen,
  onOpenChange,
  onRetry,
  onNext,
  nextQuestion,
}: AnswerQuestionModalProps) {
  const router = useRouter();
  const [showQuestionData, setShowQuestionData] = useState(false);

  const getDialogContent = useCallback(() => {
    if (correct === 'init') {
      return null;
    }
    return correct === 'correct'
      ? dialogContent.correct(user?.username || '')
      : dialogContent.incorrect;
  }, [correct, user?.username]);

  const content = getDialogContent();

  const timeTaken = convertSecondsToTime(userAnswer?.timeTaken || 0);

  const {
    data: streakData,
    refetch: refetchStreak,
    isLoading: streakLoading,
  } = useQuery({
    queryKey: ['streak-data', user.uid],
    queryFn: async () => await getUserDailyStats(user.uid),
  });

  const dateArray = [
    streakData?.streakData?.streakStart,
    streakData?.streakData?.streakEnd,
  ] as [Date, Date];

  const handleNextQuestion = () => {
    if (user.userLevel === 'FREE' && correct === 'correct') {
      return;
    }

    if (nextQuestion) {
      router.push(`/question/${nextQuestion}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-black-75 md:max-w-xl"
        aria-description="Answer question modal"
      >
        {correct === 'init' ? (
          <div className="h-36 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col items-center sm:text-center">
              <DialogTitle className="text-2xl">{content?.heading}</DialogTitle>
              <DialogDescription className="mt-2 text-center">
                {user.showTimeTaken && (
                  <>
                    <p>You answered in</p>
                    {timeTaken.minutes > 0 && (
                      <span>
                        You answered in {timeTaken.minutes} minute
                        {timeTaken.minutes > 1 && 's'}{' '}
                      </span>
                    )}
                    <span>{timeTaken.seconds} seconds</span>
                  </>
                )}
              </DialogDescription>
            </div>

            <div className="w-full flex justify-center">
              <DatePicker
                className="z-30 text-white border border-black-50 p-2 rounded-md bg-black-100 hover:cursor-default hover:text-black"
                color="white"
                type="range"
                value={dateArray}
                c="gray"
                inputMode="none"
              />
            </div>

            {correct === 'correct' && (
              <div className="text-center">
                Make sure to come back tomorrow to keep your streak going!
              </div>
            )}

            {showQuestionData && (
              <div className="mt-4">
                <JsonDisplay data={userAnswer} />
              </div>
            )}
          </>
        )}
        <DialogFooter className="flex w-full justify-between gap-3 mt-6">
          {user.userLevel === 'ADMIN' && (
            <Button
              variant="secondary"
              onClick={() => setShowQuestionData(!showQuestionData)}
            >
              {showQuestionData ? 'Hide' : 'Show'} question data
            </Button>
          )}
          <div className="flex gap-3 w-full justify-end">
            {correct === 'incorrect' ? (
              <Button variant="default" onClick={onRetry} className="!w-fit">
                Retry question
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => router.push('/dashboard')}
                fullWidth={false}
              >
                Dashboard
              </Button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1"
                    fullWidth={false}
                    disabled={user?.userLevel === 'FREE'}
                  >
                    Next question
                    {user?.userLevel === 'FREE' && <LockClosedIcon />}
                  </Button>
                  {user?.userLevel === 'FREE' && (
                    <TooltipContent>
                      <p>Upgrade to premium to unlock the next question</p>
                    </TooltipContent>
                  )}
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}