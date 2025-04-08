/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export interface TrendingTopic {
  id: number;
  name: string;
  count: number;
}

export async function GET() {
  try {
    // Fetch trending topics from Reddit
    const response = await fetch(
      "https://www.reddit.com/r/technology/hot.json?limit=10",
      {
        headers: {
          "User-Agent": "TrendPulse/1.0 (https://trends.subhadip.me)",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit API responded with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.data || !data.data.children) {
      throw new Error("Invalid data format from Reddit API");
    }
    // Transform Reddit data to our TrendingTopic format
    const redditTopics: TrendingTopic[] = data.data.children.map(
      (post: any, index: number) => ({
        id: index + 1,
        name: post.data.title.substring(0, 50), // Limit title length
        count: post.data.score, // Use upvotes as count
      })
    );

    if (!redditTopics.length) {
      throw new Error("No trending topics found");
    }

    return NextResponse.json(redditTopics);
  } catch (error: any) {
    console.error("Error fetching trending topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending topics", details: error.message },
      { status: 500 }
    );
  }
}
