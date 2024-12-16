import Link from 'next/link';
import FeaturesContentHeader from '../global/content-header';
import RoadmapGridItemOne from './grid/roadmap-grid-item-one';
import RoadmapGridItemTwo from './grid/roadmap-grid-item-two';
import RoadmapGridItemThree from './grid/roadmap-grid-item-three';

const description = () => {
  return (
    <span>
      But how are we able to create you personalised, real-world applicable
      roadmaps that can be completed from any device? It's a secret! (Just
      kidding, here's the{' '}
      <Link
        href="https://github.com/Logannford/TechBlitz/tree/main/src/actions/ai"
        className="text-accent underline"
        target="_blank"
        aria-label="GitHub link to view TechBlitz's roadmap source code."
      >
        source code
      </Link>
      ).
    </span>
  );
};

export default function FeatureRoadmapThreeGridBlock() {
  return (
    <section className="py-16 px-4 md:pt-24 md:pb-32 flex flex-col gap-y-16">
      <FeaturesContentHeader
        title="How roadmaps works"
        description={description()}
      />
      {/** demo video */}
      <div className="grid grid-cols-12 gap-10 max-w-5xl self-center relative">
        <div
          aria-hidden="true"
          className="left-1/2 top-0 md:w-full center pointer-events-none absolute h-px max-w-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.0) 0%, rgba(143, 143, 143, 0.67) 50%, rgba(0, 0, 0, 0) 100%)'
          }}
        ></div>
        <RoadmapGridItemOne />
        <RoadmapGridItemTwo />
      </div>
    </section>
  );
}
