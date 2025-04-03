import { GoogleGenAI } from "@google/genai";
import type { Sentiment } from "@prisma/client";
import { redis } from "./redis";

// Initialize the Google Gemini client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Cache TTL in seconds (7 days)
const SENTIMENT_CACHE_TTL = 7 * 24 * 60 * 60;

// Simple sentiment analysis using regex patterns for fallback
function simpleSentimentAnalysis(text: string): Sentiment {
  const positivePatterns =
    /great|good|excellent|amazing|love|awesome|fantastic|happy|best|perfect|recommend/i;
  const negativePatterns =
    /bad|terrible|awful|horrible|hate|worst|poor|disappointed|negative|issue|problem|fail/i;

  const positiveMatches = (text.match(positivePatterns) || []).length;
  const negativeMatches = (text.match(negativePatterns) || []).length;

  if (positiveMatches > negativeMatches) return "POSITIVE";
  if (negativeMatches > positiveMatches) return "NEGATIVE";
  return "NEUTRAL";
}

// Process all sentiment analysis and summary in a single API call
export async function processTrends(trends: any[]): Promise<{
  sentiments: Sentiment[];
  summary: string;
}> {
  if (trends.length === 0) {
    return { sentiments: [], summary: "No trends to analyze." };
  }

  // Generate a unique cache key for this batch of trends
  const trendIds = trends
    .slice(0, 5)
    .map((t) => t.url?.substring(0, 20) || "")
    .join("-");
  const cacheKey = `trends:${Buffer.from(trendIds)
    .toString("base64")
    .substring(0, 50)}`;

  // Check cache first
  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    try {
      const parsed =
        typeof cachedResult === "string"
          ? JSON.parse(cachedResult)
          : cachedResult;

      // Ensure the result has the required properties
      if (parsed && "sentiments" in parsed && "summary" in parsed) {
        return parsed as { sentiments: Sentiment[]; summary: string };
      }
    } catch (error) {
      console.error("Error parsing cached result:", error);
    }
  }

  // Prepare texts for sentiment analysis
  const textsToAnalyze = trends.map((trend) => {
    const content = trend.content || "";
    const title = trend.title || "";
    return title + " " + content.substring(0, 100);
  });

  // Use fallback sentiment analysis as default
  const fallbackSentiments = textsToAnalyze.map((text) =>
    simpleSentimentAnalysis(text)
  );

  try {
    // Prepare the prompt for combined sentiment analysis and summary
    const prompt = `I need two things:
1. Sentiment analysis for each of the following texts (respond with ONLY "POSITIVE", "NEUTRAL", or "NEGATIVE" for each, in order, separated by commas)
2. A summary of the key takeaways from all texts (3-5 bullet points)

Here are the texts:
${textsToAnalyze
  .map((text, i) => `Text ${i + 1}: ${text.substring(0, 150)}`)
  .join("\n\n")}

Format your response exactly like this:
SENTIMENTS: POSITIVE, NEGATIVE, NEUTRAL, ...
SUMMARY:
• First point
• Second point
• Third point`;

    // Make a single API call
    const result = await genAI.models.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      model: "gemini-1.5-flash",
      config: {
        temperature: 0.2,
        maxOutputTokens: 800,
      },
    });

    const responseText = result.text?.trim();

    // Parse the response
    const sentimentMatch = responseText?.match(
      /SENTIMENTS:\s*(.*?)(?=\nSUMMARY:|$)/
    );
    const summaryMatch = responseText?.match(/SUMMARY:([\s\S]*)/);

    let sentiments: Sentiment[] = [...fallbackSentiments]; // Default to fallback
    let summary = "Unable to generate summary.";

    if (sentimentMatch && sentimentMatch[1]) {
      const sentimentValues = sentimentMatch[1]
        .trim()
        .split(",")
        .map((s) => s.trim().toUpperCase());
      sentiments = sentimentValues.map((s) => {
        if (s.includes("POSITIVE")) return "POSITIVE";
        if (s.includes("NEGATIVE")) return "NEGATIVE";
        return "NEUTRAL";
      });

      // If we don't have enough sentiments, fill with fallback
      if (sentiments.length < trends.length) {
        sentiments = [
          ...sentiments,
          ...fallbackSentiments.slice(sentiments.length),
        ];
      }
    }

    if (summaryMatch && summaryMatch[1]) {
      summary = summaryMatch[1].trim();
    }

    const result2 = { sentiments, summary };

    // Cache the result
    await redis.set(cacheKey, JSON.stringify(result2), { ex: 3600 }); // Cache for 1 hour

    return result2;
  } catch (error) {
    console.error("Error processing trends:", error);
    // Return fallback results
    return {
      sentiments: fallbackSentiments,
      summary: "Error generating summary. Please try again later.",
    };
  }
}

// Single text sentiment analysis (for backward compatibility)
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  // Check cache first
  const cacheKey = `sentiment:${Buffer.from(text)
    .toString("base64")
    .substring(0, 100)}`;
  const cachedSentiment = await redis.get(cacheKey);

  if (cachedSentiment) {
    return cachedSentiment as Sentiment;
  }

  // Use fallback sentiment analysis
  const sentiment = simpleSentimentAnalysis(text);

  // Cache the result
  await redis.set(cacheKey, sentiment, { ex: SENTIMENT_CACHE_TTL });

  return sentiment;
}

// Batch sentiment analysis (for backward compatibility)
export async function batchAnalyzeSentiment(
  texts: string[]
): Promise<Sentiment[]> {
  return Promise.all(texts.map((text) => analyzeSentiment(text)));
}

// Generate summary (for backward compatibility)
export async function generateSummary(trends: any[]): Promise<string> {
  if (trends.length === 0) return "No trends to summarize.";

  // Check cache first
  const cacheKey = `summary:${trends.length}:${trends
    .slice(0, 3)
    .map((t) => t.id)
    .join("-")}`;
  const cachedSummary = await redis.get(cacheKey);

  if (cachedSummary) {
    return cachedSummary as string;
  }

  try {
    // Process in a single call if not cached
    const { summary } = await processTrends(trends);

    // Cache the summary
    await redis.set(cacheKey, summary, { ex: 3600 });

    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error generating summary. Please try again later.";
  }
}
