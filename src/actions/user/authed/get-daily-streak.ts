'use server';

import { prisma } from '@/utils/prisma';
import { revalidateTag } from 'next/cache';

export const getUserDailyStats = async (userUid: string) => {
  const userData = await prisma.users.findUnique({
    where: {
      uid: userUid,
    },
    include: {
      streak: true,
    },
  });
  if (!userData) return null;

  const streakData = userData.streak;

  revalidateTag(`user-streak-${userUid}`);

  return { streakData };
};
