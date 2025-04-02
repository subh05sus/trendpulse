import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export async function cacheSearch(query: string, data: any) {
  // Cache for 30 minutes
  await redis.set(`search:${query.toLowerCase()}`, JSON.stringify(data), {
    ex: 1800,
  });
}

export async function getCachedSearch(query: string) {
  const cached = await redis.get(`search:${query.toLowerCase()}`);
  if (cached) {
    if (typeof cached === "string") {
      return JSON.parse(cached);
    }
    return cached; // Already an object, return as is
  }
  return null;
}

export async function invalidateCache(query: string) {
  await redis.del(`search:${query.toLowerCase()}`);
}

export async function cacheTopTrends(trends: any) {
  await redis.set("top_trends", JSON.stringify(trends), {
    ex: 3600, // Cache for 1 hour
  });
}

export async function getCachedTopTrends() {
  const cached = await redis.get("top_trends");
  if (cached) {
    return JSON.parse(cached as string);
  }
  return null;
}
