/* eslint-disable @typescript-eslint/no-explicit-any */
type Tweet = {
  id: string;
  text: string;
  author: {
    username: string;
    name: string;
  };
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  url: string;
};

export async function searchTwitter(
  query: string,
  maxResults = 10
): Promise<Tweet[]> {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      throw new Error("Twitter API bearer token is not configured");
    }

    const response = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
        query
      )}&max_results=${maxResults}&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=name,username`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    const users = data.includes.users.reduce((acc: any, user: any) => {
      acc[user.id] = user;
      return acc;
    }, {});

    return data.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      author: {
        username: users[tweet.author_id].username,
        name: users[tweet.author_id].name,
      },
      created_at: tweet.created_at,
      public_metrics: tweet.public_metrics,
      url: `https://twitter.com/${users[tweet.author_id].username}/status/${
        tweet.id
      }`,
    }));
  } catch (error) {
    console.error("Error fetching Twitter data:", error);
    return [];
  }
}

// This function is kept for backward compatibility
export async function formatTwitterResults(tweets: Tweet[]) {
  return tweets.map((tweet) => {
    const metrics = tweet.public_metrics;

    return {
      title:
        tweet.text.substring(0, 100) + (tweet.text.length > 100 ? "..." : ""),
      content: tweet.text,
      url: tweet.url,
      platform: "TWITTER" as const,
      authorName: `@${tweet.author.username}`,
      publishedAt: new Date(tweet.created_at),
      engagement:
        metrics.retweet_count +
        metrics.reply_count +
        metrics.like_count +
        metrics.quote_count,
      sentiment: "NEUTRAL" as const, // Default sentiment, will be updated later
    };
  });
}
