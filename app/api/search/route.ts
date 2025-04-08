import { type NextRequest, NextResponse } from "next/server";
import { aggregateTrends } from "@/lib/trend-aggregator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchCache } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    // Try to get cached results first - but don't let cache failures block the request
    let cachedResults = null;
    try {
      cachedResults = await searchCache.get(query);
    } catch (error) {
      console.error("Cache retrieval error:", error);
      // Continue with non-cached data if cache fails
    }

    if (cachedResults) {
      console.log(`Cache hit for query: "${query}"`);
      return NextResponse.json(cachedResults);
    }

    console.log(`Cache miss for query: "${query}", fetching fresh data`);
    // No cache hit, get fresh results
    const results = await aggregateTrends(query, userId);

    // Store results in cache (don't await this to improve response time)
    if (results) {
      // Don't block the response on cache operations
      searchCache.set(query, results).catch((err) => {
        console.error("Failed to store results in cache:", err);
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
