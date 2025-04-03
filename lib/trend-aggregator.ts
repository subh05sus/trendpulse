/* eslint-disable @typescript-eslint/no-explicit-any */
import { searchYouTube } from "./youtube-api";
import { searchReddit } from "./reddit-api";
import { searchTwitter } from "./twitter-api";
import { saveSearch, saveTrend } from "./db";
import { cacheSearch, getCachedSearch } from "./redis";
import { processTrends } from "./ai";

// Limit the number of results to process to avoid API rate limits
const MAX_RESULTS_PER_PLATFORM = 10;

export async function aggregateTrends(query: string, userId?: string) {
  // Check cache first
  const cached = await getCachedSearch(query);
  if (cached) {
    return cached;
  }

  // Create a new search record
  const search = await saveSearch(query, userId);

  // Fetch data from all platforms in parallel with reduced result counts
  const [youtubeVideos, redditPosts, tweets] = await Promise.all([
    searchYouTube(query, MAX_RESULTS_PER_PLATFORM),
    searchReddit(query, MAX_RESULTS_PER_PLATFORM),
    searchTwitter(query, MAX_RESULTS_PER_PLATFORM),
  ]);

  // Format results without sentiment analysis
  const youtubeResultsRaw = youtubeVideos.map((video: any) => ({
    title: video.title,
    content: video.description,
    url: video.url,
    platform: "YOUTUBE" as const,
    authorName: video.channelTitle,
    publishedAt: new Date(video.publishedAt),
    engagement: video.viewCount + video.likeCount + video.commentCount,
    sentiment: "NEUTRAL" as const, // Default sentiment, will be updated
  }));

  const redditResultsRaw = redditPosts.map((post: any) => ({
    title: post.title,
    content: post.selftext || post.title,
    url: post.url,
    platform: "REDDIT" as const,
    authorName: post.author,
    publishedAt: new Date(post.created_utc * 1000),
    engagement: post.score + post.num_comments,
    sentiment: "NEUTRAL" as const, // Default sentiment, will be updated
    subreddit: post.subreddit,
  }));

  const twitterResultsRaw = tweets.map((tweet) => {
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
      sentiment: "NEUTRAL" as const, // Default sentiment, will be updated
    };
  });

  // Combine all results
  const allTrendsRaw = [
    ...youtubeResultsRaw,
    ...redditResultsRaw,
    ...twitterResultsRaw,
  ];

  // Process all trends in a single API call (sentiment analysis + summary)
  const { sentiments, summary } = await processTrends(allTrendsRaw);

  // Apply sentiments to trends
  const allTrends = allTrendsRaw.map((trend: any, index) => ({
    ...trend,
    sentiment: sentiments[index] || trend.sentiment,
  }));

  // // Split back into platform-specific arrays
  // const youtubeResults = allTrends.slice(0, youtubeResultsRaw.length);
  // const redditResults = allTrends.slice(
  //   youtubeResultsRaw.length,
  //   youtubeResultsRaw.length + redditResultsRaw.length
  // );
  // const twitterResults = allTrends.slice(
  //   youtubeResultsRaw.length + redditResultsRaw.length
  // );

  // Save trends to database
  const savedTrends = await Promise.all(
    allTrends.map((trend) =>
      saveTrend(
        search.id,
        trend.title,
        trend.content,
        trend.url,
        trend.platform,
        trend.authorName,
        trend.publishedAt,
        trend.engagement,
        trend.sentiment
      )
    )
  );

  // Map the saved trends (with IDs) back to our result trends
  const trendsWithIds = savedTrends.map((savedTrend: any, index) => ({
    ...allTrends[index],
    id: savedTrend.id,
  }));

  // Split back into platform-specific arrays with IDs
  const youtubeResultsWithIds = trendsWithIds.slice(
    0,
    youtubeResultsRaw.length
  );
  const redditResultsWithIds = trendsWithIds.slice(
    youtubeResultsRaw.length,
    youtubeResultsRaw.length + redditResultsRaw.length
  );
  const twitterResultsWithIds = trendsWithIds.slice(
    youtubeResultsRaw.length + redditResultsRaw.length
  );

  const result = {
    searchId: search.id,
    query,
    summary,
    trends: {
      youtube: youtubeResultsWithIds,
      reddit: redditResultsWithIds,
      twitter: twitterResultsWithIds,
    },
    allTrends: trendsWithIds,
  };

  // Cache the results
  await cacheSearch(query, result);

  return result;
}
