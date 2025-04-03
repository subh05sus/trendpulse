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
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform Reddit data to our TrendingTopic format
    const redditTopics: TrendingTopic[] = data.data.children.map(
      (post: any, index: number) => ({
        id: index + 1,
        name: post.data.title.substring(0, 50), // Limit title length
        count: post.data.score, // Use upvotes as count
      })
    );

    return NextResponse.json(redditTopics);
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending topics" },
      { status: 500 }
    );
  }
}
