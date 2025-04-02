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
    const response = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(
        query
      )}&sort=relevance&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.data.children.map((child: any) => ({
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
    }));
  } catch (error) {
    console.error("Error fetching Reddit data:", error);
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
