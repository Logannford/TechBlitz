'use server';
import { prisma } from '@/utils/prisma';

export const getFastestTimes = async (opts: {
  questionUid: string;
  numberOfResults?: number;
  page?: number;
  pageSize?: number;
}) => {
  const { questionUid, numberOfResults, page, pageSize } = opts;

  if (!questionUid) {
    throw new Error('Missing required parameter: questionUid');
  }

  let take: number | undefined;
  let skip: number | undefined;

  if (numberOfResults !== undefined) {
    // Fixed number of results
    take = numberOfResults;
  } else if (page !== undefined && pageSize !== undefined) {
    // Pagination
    take = pageSize;
    skip = (page - 1) * pageSize;
  } else {
    throw new Error(
      'Either numberOfResults or both page and pageSize must be provided'
    );
  }

  // only return the fastest times for correct answers
  const answers = await prisma.answers.findMany({
    where: {
      questionUid,
      correctAnswer: true,
    },
    take,
    skip,
    orderBy: {
      timeTaken: 'asc',
    },
    include: {
      user: true,
    },
  });

  const total = await prisma.answers.count({
    where: {
      questionUid,
      correctAnswer: true,
    },
  });

  return {
    fastestTimes: answers,
    total,
    page: page || 1,
    pageSize: pageSize || total,
    totalPages: Math.ceil(total / (pageSize || total)),
  };
};