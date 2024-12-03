import { Button } from '@/components/ui/button';
import { Grid } from '@/components/ui/grid';
import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import CodeDisplay from '@/components/questions/single/code-snippet';
import RoadmapFeatureBox from './roadmap-feature-box';
import Link from 'next/link';
import DailyQuestionBox from './daily-question-box';

const cardClasses = 'border border-black-50 p-6';
const codeSnippet = `let numbers = [5, 3, 7];
let sum = numbers.reduce((acc, num) => acc + num);
// Missing line here
// another missing line
// and another!
// Missing line here
// another missing line
// and another!
// Missing line here
// another missing line
// and another!console.log(result);`;

export default function FeaturesBentoGrid() {
  return (
    <div className="pt-28 pb-20 flex flex-col gap-y-7 relative">
      <div className="flex flex-col gap-y-1 items-center text-center">
        <div className="group w-fit relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Features
          </span>
        </div>
        <h1 className="text-2xl lg:text-4xl !font-onest !leading-[normal] text-gradient from-white to-white/55">
          Software engineering is easy{' '}
        </h1>
        <span className="text-xs text-gradient from-white to-white/55">
          (with us)
        </span>
      </div>
      <div
        className="card-wrapper h-[450px]
      "
      >
        <div className="card-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-black-400">
          <Link
            href="/features/roadmap"
            className={cn(
              'col-span-full lg:col-span-2 !border-r-0 !border-b-0 relative overflow-hidden group flex gap-5',
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
                className="flex gap-x-2 items-center w-fit font-onest"
              >
                Learn more{' '}
                <ChevronRight className="size-4 group-hover:ml-1 duration-300" />
              </Button>
            </div>

            <RoadmapFeatureBox />

            {/* <Image
              src={FeaturesRoadmapImg}
              alt="Features Roadmap"
              layout="responsive"
              placeholder="blur"
              className="z-50 absolute -right-20 top-0 border border-black-50"
            /> */}

            <Grid
              size={20}
              position="bottom-left"
            />
          </Link>
          <div
            className={cn(
              '!border-b-0 flex flex-col justify-between group overflow-hidden',
              cardClasses
            )}
          >
            <div className="flex flex-col gap-y-1 h-fit">
              <h6 className="text-2xl text-gradient from-white to-white/55">
                Daily questions
              </h6>
              <p className="text-xs text-gray-400">
                Daily questions will help you reinforce your learning and
                understand concepts.
              </p>
              <Button
                variant="link"
                padding="none"
                className="text-white"
              >
                Answer now{' '}
                <ChevronRight className="size-4 group-hover:ml-1 duration-300" />
              </Button>
              <DailyQuestionBox />
            </div>
            {/* <Button
              href="/signup?ref=daily-question"
              variant="link"
              padding="none"
              className="flex gap-x-2 items-center w-fit text-white group-hover:underline"
            >
              Answer now{' '}
              <ChevronRight className="size-4 group-hover:ml-1 duration-300" />
            </Button> */}
          </div>
          <div className={cn('!border-r-0', cardClasses)}>
            <div className="flex flex-col gap-y-1">
              <h6 className="text-2xl text-gradient from-white to-white/55">
                Leaderboard
              </h6>
              <p className="text-xs text-gray-400">
                Our AI powered roadmap will help you take the next step in your
                developer journey.
              </p>
              {/** display user's who've answered the most questions */}
              <div className=""></div>
            </div>
          </div>
          <div className={cn('col-span-full lg:col-span-2', cardClasses)}>
            <div className="flex flex-col gap-y-1">
              <h6 className="text-2xl text-gradient from-white to-white/55">
                Progress tracking
              </h6>
              <p className="text-xs text-gray-400">
                Our AI powered roadmap will help you take the next step in your
                developer journey.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Fade-out gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none"></div>
    </div>
  );
}
