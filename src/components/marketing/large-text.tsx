'use client';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HomepageLargeText() {
  const text =
    'Elevate your skills with personalized learning paths that adapt to your journey as a developer.';
  // Split the text into an array of words
  const words = text.split(' ');

  return (
    <section className="pt-32 pb-44">
      <h2 className="text-5xl lg:text-7xl text-gradient from-white to-white/55 py-4">
        <AnimatePresence>
          {words.map((word, index) => (
            <Word
              key={index}
              word={word}
              index={index}
            />
          ))}
        </AnimatePresence>
      </h2>
    </section>
  );
}

function Word({ word, index }: { word: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.2
      }}
      className="inline-block mr-2 text-white"
    >
      {word}
    </motion.span>
  );
}
