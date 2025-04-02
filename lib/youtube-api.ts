type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  url: string;
};

export async function searchYouTube(
  query: string,
  maxResults = 10
): Promise<YouTubeVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YouTube API key is not configured");
    }

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .join(",");

    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`
    );

    if (!videoResponse.ok) {
      throw new Error(`YouTube API error: ${videoResponse.statusText}`);
    }

    const videoData = await videoResponse.json();

    return videoData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      viewCount: Number.parseInt(item.statistics.viewCount || "0"),
      likeCount: Number.parseInt(item.statistics.likeCount || "0"),
      commentCount: Number.parseInt(item.statistics.commentCount || "0"),
      url: `https://www.youtube.com/watch?v=${item.id}`,
    }));
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return [];
  }
}

// This function is kept for backward compatibility
export async function formatYouTubeResults(videos: YouTubeVideo[]) {
  return videos.map((video) => {
    return {
      title: video.title,
      content: video.description,
      url: video.url,
      platform: "YOUTUBE" as const,
      authorName: video.channelTitle,
      publishedAt: new Date(video.publishedAt),
      engagement: video.viewCount + video.likeCount + video.commentCount,
      sentiment: "NEUTRAL" as const, // Default sentiment, will be updated later
    };
  });
}
