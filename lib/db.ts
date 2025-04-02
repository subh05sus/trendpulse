import { PrismaClient } from "@prisma/client";
import type { Platform, Sentiment } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function saveSearch(query: string, userId?: string) {
  return prisma.search.create({
    data: {
      query,
      userId,
    },
  });
}

export async function saveTrend(
  searchId: string,
  title: string,
  content: string,
  url: string,
  platform: Platform,
  authorName: string | null,
  publishedAt: Date,
  engagement: number,
  sentiment: Sentiment
) {
  return prisma.trend.create({
    data: {
      searchId,
      title,
      content,
      url,
      platform,
      authorName,
      publishedAt,
      engagement,
      sentiment,
    },
  });
}

export async function getTrendsBySearchId(searchId: string) {
  return prisma.trend.findMany({
    where: {
      searchId,
    },
    orderBy: {
      engagement: "desc",
    },
  });
}

export async function getRecentSearches(limit = 5) {
  return prisma.search.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      trends: {
        take: 1,
      },
    },
  });
}

export async function addComment(
  userId: string,
  trendId: string,
  content: string
) {
  return prisma.comment.create({
    data: {
      userId,
      trendId,
      content,
    },
  });
}

export async function getCommentsByTrendId(trendId: string) {
  return prisma.comment.findMany({
    where: {
      trendId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
