'use client';

import { UserRoadmaps } from '@/types/Roadmap';
import Link from 'next/link';
import { Grid } from '../../ui/grid';
import Chip from '../../ui/chip';
import { capitalise } from '@/utils';
import RoadmapCardMenu from './roadmap-card-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RoadmapsCard(opts: { roadmap: UserRoadmaps }) {
  const { roadmap: initialRoadmap } = opts;

  const [isLoading, setIsLoading] = useState(false);
  const roadmapRef = useRef(initialRoadmap);

  useEffect(() => {
    if (!isLoading) {
      roadmapRef.current = initialRoadmap;
    }
  }, [initialRoadmap, isLoading]);

  const handleDeleteStart = () => {
    setIsLoading(true);
  };

  const handleDeleteEnd = () => {
    setIsLoading(false);
  };

  const href =
    roadmapRef.current.status === 'ACTIVE' ||
    roadmapRef.current.status === 'COMPLETED'
      ? `/roadmap/${roadmapRef.current.uid}`
      : `/roadmap/${roadmapRef.current.uid}/onboarding/${roadmapRef.current.currentQuestionIndex}`;

  return (
    <Link
      href={href}
      className="py-6 mb-6 space-y-5 items-start border border-black-50 p-5 rounded-lg group w-full h-auto flex flex-col relative overflow-hidden"
    >
      <div className="flex w-full justify-between gap-3">
        <div className="flex flex-col gap-y-3 font-ubuntu w-full">
          <AnimatePresence mode="wait">
            <motion.h6
              key={isLoading ? 'loading' : 'content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-base text-wrap text-start"
            >
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                roadmapRef.current.title
              )}
            </motion.h6>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoading ? 'loading' : 'content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </>
              ) : (
                roadmapRef.current.description && (
                  <p className="text-sm">
                    {roadmapRef.current.description.length > 100
                      ? `${roadmapRef.current.description.slice(0, 100)}...`
                      : roadmapRef.current.description}
                  </p>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <RoadmapCardMenu
          roadmapUid={roadmapRef.current.uid}
          onDeleteStart={handleDeleteStart}
          onDeleteEnd={handleDeleteEnd}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? 'loading' : 'content'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 w-full flex justify-between items-end relative z-10"
        >
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </>
          ) : (
            <>
              <Chip
                text={
                  roadmapRef.current.questions.length.toString() +
                  ' ' +
                  'Questions'
                }
                color="white"
                textColor="black"
              />
              <div className="flex items-center gap-x-3">
                {roadmapRef.current.status && (
                  <Chip
                    text={capitalise(roadmapRef.current.status)}
                    color="black-100"
                    border="black-50"
                  />
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <Grid
        size={20}
        position="bottom-right"
      />
    </Link>
  );
}
