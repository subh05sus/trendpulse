/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export interface TrendingTopic {
  id: number;
  name: string;
  count: number;
}

// Mock data for when Reddit API fails
const mockTrendingTopics: TrendingTopic[] = [
  { id: 1, name: "Apple unveils new AI features for iOS 18", count: 4210 },
  {
    id: 2,
    name: "Tesla announces breakthrough in battery technology",
    count: 3845,
  },
  { id: 3, name: "Microsoft's quantum computing milestone", count: 3562 },
  {
    id: 4,
    name: "New cybersecurity threats targeting remote workers",
    count: 2987,
  },
  { id: 5, name: "SpaceX successfully lands Starship prototype", count: 2756 },
  { id: 6, name: "EU passes new tech regulation framework", count: 2534 },
  { id: 7, name: "Breakthrough in renewable energy storage", count: 2187 },
  {
    id: 8,
    name: "AI generates novel protein structures for medicine",
    count: 1876,
  },
  {
    id: 9,
    name: "Open-source AI model surpasses commercial options",
    count: 1654,
  },
  {
    id: 10,
    name: "Major tech companies commit to carbon neutrality",
    count: 1432,
  },
];

export async function GET() {
  try {
    // Fetch trending topics from Reddit
    try {
      const response = await fetch(
        "https://www.reddit.com/r/technology/hot.json?limit=10",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; TrendPulseBot/1.0; +https://trends.subhadip.me)",
          },
        }
      );
      console.log("Reddit response status:", response.status);
      console.log("Reddit response headers:", response.headers);

      if (!response.ok) {
        console.log("Reddit API failed, using mock data");
        return NextResponse.json(mockTrendingTopics);
      }

      const data = await response.json();
      if (!data || !data.data || !data.data.children) {
        console.log("Invalid data format from Reddit API, using mock data");
        return NextResponse.json(mockTrendingTopics);
      }

      console.log("Reddit data:", data);
      // Transform Reddit data to our TrendingTopic format
      const redditTopics: TrendingTopic[] = data.data.children.map(
        (post: any, index: number) => ({
          id: index + 1,
          name: post.data.title.substring(0, 50), // Limit title length
          count: post.data.score, // Use upvotes as count
        })
      );

      if (!redditTopics.length) {
        console.log("No trending topics found, using mock data");
        return NextResponse.json(mockTrendingTopics);
      }

      return NextResponse.json(redditTopics);
    } catch (fetchError: any) {
      console.log("Error fetching from Reddit:", fetchError.message);
      return NextResponse.json(mockTrendingTopics);
    }
  } catch (error: any) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(mockTrendingTopics);
  }
}
