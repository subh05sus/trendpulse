import { getRedditAccessToken } from "./utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type RedditPost = {
  id: string;
  title: string;
  selftext: string;
  author: string;
  created_utc: number;
  score: number;
  num_comments: number;
  permalink: string;
  url: string;
  subreddit: string;
};

export async function searchReddit(
  query: string,
  limit = 10
): Promise<RedditPost[]> {
  try {
    const token = await getRedditAccessToken();

    if (!token) throw new Error("No Reddit access token");

    if (!query) {
      throw new Error("Query parameter is required");
    }

    const url = `https://oauth.reddit.com/search?q=${encodeURIComponent(
      query
    )}&sort=relevance&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyApp/1.0.0 (by u/SubhadipSahaOfficial)",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      `[Reddit] Response status: ${response.status} ${response.statusText}`
    );
    if (!response.ok) {
      console.error(
        `[Reddit] API error: ${response.status} ${response.statusText}`
      );
      throw new Error(`Reddit API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.children) {
      console.warn(
        "[Reddit] Unexpected response structure:",
        JSON.stringify(data).substring(0, 200) + "..."
      );
      return [];
    }

    const posts = data.data.children.map((child: any) => {
      return {
        id: child.data.id,
        title: child.data.title,
        selftext: child.data.selftext,
        author: child.data.author,
        created_utc: child.data.created_utc,
        score: child.data.score,
        num_comments: child.data.num_comments,
        permalink: child.data.permalink,
        url: `https://www.reddit.com${child.data.permalink}`,
        subreddit: child.data.subreddit_name_prefixed,
      };
    });

    console.log(`[Reddit] Successfully processed ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error("[Reddit] Error fetching Reddit data:", error);
    console.error(
      "[Reddit] Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return [];
  }
}

// This function is kept for backward compatibility
export async function formatRedditResults(posts: RedditPost[]) {
  return posts.map((post) => {
    return {
      title: post.title,
      content: post.selftext || post.title,
      url: post.url,
      platform: "REDDIT" as const,
      authorName: post.author,
      publishedAt: new Date(post.created_utc * 1000),
      engagement: post.score + post.num_comments,
      sentiment: "NEUTRAL" as const, // Default sentiment, will be updated later
      subreddit: post.subreddit,
    };
  });
}
