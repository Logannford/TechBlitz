'use client';

import { cn } from '@/utils/cn';
import React, { useEffect, useState } from 'react';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string;
    title: string;
  }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        );
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-4 py-16 w-max flex-nowrap',
          start && 'animate-scroll-right',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => (
          <li
            className={cn(
              'bg-black-100 w-[150px] relative rounded-2xl border flex-shrink-0 border-black-50 p-4 md:w-[200px] transition-all',
              idx % 2 === 0 ? '-translate-y-16' : 'translate-y-16'
            )}
            key={item.name}
          >
            {/* Roadmap marker line */}
            <div
              className={cn(
                'absolute left-1/2 w-px bg-black-50',
                idx % 2 === 0
                  ? 'bottom-0 h-[25px] translate-y-full'
                  : 'top-0 h-[25px] -translate-y-full'
              )}
            >
              {/* Dot at the connection point */}
              <div
                className={cn(
                  'absolute left-1/2 size-1.5 rounded-full bg-black-50 -translate-x-1/2',
                  idx % 2 !== 0 ? 'top-0' : 'bottom-0'
                )}
              />
            </div>

            <div
              aria-hidden="true"
              className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
            ></div>
            <div className="relative z-20 flex size-full justify-center items-center">
              <span className="text-center leading-[1.6] text-white font-ubuntu font-normal">
                {item.title}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
