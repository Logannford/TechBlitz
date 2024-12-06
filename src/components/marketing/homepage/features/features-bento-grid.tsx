import { Button } from '@/components/ui/button';
import { Grid } from '@/components/ui/grid';
import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import RoadmapFeatureBox from './roadmap-feature-box';
import Link from 'next/link';
import DailyQuestionBox from './daily-question-box';
import LeaderboardBentoBox from './leaderboard-bento-box';
import ProgressionBentoBox from './progression-box';

const cardClasses = 'border border-black-50 p-6 rounded-lg';

export default function FeaturesBentoGrid() {
  // if on prod, make all links be disabled go to '/'
  const isProd = process.env.NEXT_PUBLIC_ENV === 'production';

  return (
    <section className="pt-10 lg:pt-28 pb-10 md:pb-20 flex flex-col gap-y-7 relative">
      <div className="flex flex-col gap-y-1 items-center text-center">
        <div className="group w-fit relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Features
          </span>
        </div>
        <h1 className="text-2xl lg:text-5xl !font-onest !leading-[normal] text-gradient from-white to-white/55">
          We make Software engineering easy{' '}
        </h1>
        <span className="text-gray-400 max-w-3xl">
          Daily questions, leaderboards, AI generated progression paths & 1000's
          of questions designed to aid in solving real-world software problems.
          Everything you need to become a better developer.
        </span>
      </div>
      <div className="min-h-[1400px] md:min-h-[1000px] lg:min-h-[700px] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-black-400 rounded-lg">
          <Link
            href={isProd ? '' : '/features/roadmap'}
            className={cn(
              'h-80 col-span-full lg:col-span-2 relative overflow-hidden group flex flex-col sm:flex-row gap-5',
              cardClasses
            )}
          >
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-y-1 relative max-w-sm">
                <h6 className="text-2xl text-gradient from-white to-white/55">
                  AI Powered Progression Paths
                </h6>
                <p className="text-xs text-gray-400">
                  Our AI powered roadmap will help you take the next step in
                  your developer journey.
                </p>
              </div>
              <Button
                variant="secondary"
                className="z-10 relative gap-x-2 items-center w-fit font-onest hidden md:flex"
              >
                Learn more{' '}
                <ChevronRight className="size-4 group-hover:ml-1 duration-300" />
              </Button>
            </div>
            <RoadmapFeatureBox />
            <Grid
              size={20}
              position="bottom-left"
            />
          </Link>
          <Link
            href={isProd ? '' : '/features/progress-tracking'}
            className={cn(
              'h-[390px] lg:h-80 flex flex-col justify-between group overflow-hidden',
              cardClasses
            )}
          >
            <div className="flex flex-col gap-y-4 relative">
              <div className="flex flex-col gap-y-1">
                <h6 className="text-2xl text-gradient from-white to-white/55">
                  Progress tracking
                </h6>
                <p className="text-xs text-gray-400">
                  Track your progress and view your strengths and weaknesses as
                  you learn.
                </p>
              </div>
              <div className="w-full h-fit flex items-center justify-center">
                <ProgressionBentoBox />
              </div>
            </div>
          </Link>
          <Link
            href={isProd ? '' : '/features/leaderboard'}
            className={cn('relative overflow-hidden group', cardClasses)}
          >
            <LeaderboardBentoBox />
            <div className="flex flex-col gap-y-1">
              <h6 className="text-2xl text-gradient from-white to-white/55">
                Leaderboard
              </h6>
              <p className="text-xs text-gray-400">
                Compete with other developers and see how you stack up against
                them!
              </p>
            </div>
          </Link>
          <Link
            href={isProd ? '' : '/features/daily-questions'}
            className={cn(
              'col-span-full lg:col-span-2 group overflow-hidden',
              cardClasses
            )}
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-y-1 h-fit">
                <h6 className="text-2xl text-gradient from-white to-white/55">
                  Daily questions
                </h6>
                <p className="text-xs text-gray-400">
                  Daily questions will help you reinforce your learning and
                  understand concepts.
                </p>
              </div>
              <Button
                variant="accent"
                className="font-onest !bg-gradient-to-r !from-accent !via-white/20 !to-accent animate-shimmer bg-[length:200%_100%] transition-colors"
              >
                Learn more{' '}
                <ChevronRight className="size-4 group-hover:ml-1 duration-300" />
              </Button>
            </div>
            <div className="relative">
              <DailyQuestionBox />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
