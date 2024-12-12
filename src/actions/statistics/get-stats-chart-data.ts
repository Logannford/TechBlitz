'use server';
import { StatsChartData, StatsSteps } from '@/types/Stats';
import { prisma } from '@/utils/prisma';
import { getRange } from '@/utils/stats/get-range';
import { revalidateTag } from 'next/cache';

/**
 * Method to get all the question data for the user and return it
 * in a format to display in a chart.
 *
 * We return the data in the following format:
 * [key]: { totalQuestions: number, tags: string[], tagCounts: Record<string, number> }
 */
export const getStatsChartData = async (opts: {
  userUid: string;
  to: string;
  from: StatsSteps;
  step: 'month' | 'week' | 'day';
}) => {
  const { userUid, to, from, step } = opts;

  if (!userUid) {
    return null;
  }

  const toDate = new Date(to);
  const fromDate = getRange(from);

  const questions = await prisma.answers.findMany({
    where: {
      userUid,
      createdAt: {
        gte: fromDate,
        lte: toDate
      }
    },
    include: {
      question: {
        select: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      }
    }
  });

  const data: StatsChartData = {};

  questions.forEach((answer) => {
    let key: string;
    switch (step) {
      case 'month':
        key = answer.createdAt.toISOString().slice(0, 7);
        break;
      case 'week':
        const weekStart = new Date(answer.createdAt);
        weekStart.setDate(
          answer.createdAt.getDate() - answer.createdAt.getDay()
        );
        key = weekStart.toISOString().slice(0, 10);
        break;
      case 'day':
        key = formatDayLabel(answer.createdAt);
        break;
    }

    const tags = answer.question.tags.map((tag) => tag.tag.name);

    if (data[key]) {
      data[key].totalQuestions++;
      tags.forEach((tag) => {
        data[key].tagCounts[tag] = (data[key].tagCounts[tag] || 0) + 1;
        if (!data[key].tags.includes(tag)) {
          data[key].tags.push(tag);
        }
      });
    } else {
      const tagCounts: Record<string, number> = {};
      tags.forEach((tag) => {
        tagCounts[tag] = 1;
      });
      data[key] = {
        totalQuestions: 1,
        tagCounts,
        tags: [...tags]
      };
    }
  });

  revalidateTag('statistics');

  return data;
};

/**
 * Gets the total number of questions the user has answered within a specific range.
 */
export const getTotalQuestionCount = async (
  userUid: string,
  to: string,
  from: StatsSteps
) => {
  if (!userUid) {
    return null;
  }

  const toDate = new Date(to);
  const fromDate = getRange(from);

  const questions = await prisma.answers.count({
    where: {
      userUid,
      createdAt: {
        gte: fromDate,
        lte: toDate
      }
    }
  });

  revalidateTag('statistics');

  return questions;
};

/**
 * Gets the total time taken for questions answered within a specific range.
 */
export const getTotalTimeTaken = async (
  userUid: string,
  to: string,
  from: StatsSteps
) => {
  if (!userUid) {
    return null;
  }

  const toDate = new Date(to);
  const fromDate = getRange(from);

  const answers = await prisma.answers.findMany({
    where: {
      userUid,
      createdAt: {
        gte: fromDate,
        lte: toDate
      }
    },
    select: {
      timeTaken: true
    }
  });

  const totalTime = answers.reduce(
    (acc, answer) => acc + (answer.timeTaken || 0),
    0
  );

  revalidateTag('statistics');

  return totalTime;
};

/**
 * Gets the highest scoring tag within a specific range.
 */
export const getHighestScoringTag = async (
  userUid: string,
  to: string,
  from: StatsSteps
) => {
  if (!userUid) {
    return null;
  }

  const toDate = new Date(to);
  const fromDate = getRange(from);

  const answers = await prisma.answers.findMany({
    where: {
      userUid,
      createdAt: {
        gte: fromDate,
        lte: toDate
      }
    },
    include: {
      question: {
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      }
    }
  });

  const tagCounts: Record<string, number> = {};

  answers.forEach((answer) => {
    answer.question.tags.forEach((tag) => {
      const tagName = tag.tag.name;
      tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
    });
  });

  const highestScoringTag = Object.keys(tagCounts).reduce(
    (a, b) => (tagCounts[a] > tagCounts[b] ? a : b),
    ''
  );

  revalidateTag('statistics');

  return {
    tag: highestScoringTag,
    count: tagCounts[highestScoringTag]
  };
};

export const getData = async (opts: {
  userUid: string;
  to: string;
  from: StatsSteps;
  step: 'month' | 'week' | 'day';
}) => {
  const { userUid, to, from } = opts;

  const [stats, totalQuestions, totalTimeTaken, highestScoringTag] =
    await Promise.all([
      getStatsChartData(opts),
      getTotalQuestionCount(userUid, to, from),
      getTotalTimeTaken(userUid, to, from),
      getHighestScoringTag(userUid, to, from)
    ]);

  return { stats, totalQuestions, totalTimeTaken, highestScoringTag };
};

// Helper function to format day label
const formatDayLabel = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();

  return `${dayOfWeek}, ${month} ${dayOfMonth}`;
};