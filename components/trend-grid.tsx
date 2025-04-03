/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { TrendCard } from "@/components/trend-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Trend = {
  id: string;
  title: string;
  content: string;
  url: string;
  platform: "YOUTUBE" | "REDDIT" | "TWITTER";
  authorName: string | null;
  publishedAt: Date;
  engagement: number;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
};

type TrendGridProps = {
  trends: Trend[];
};

export function TrendGrid({ trends }: TrendGridProps) {
  const [platform, setPlatform] = useState<string>("all");
  const [sentiment, setSentiment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("engagement");

  const filteredTrends = trends.filter((trend) => {
    if (platform !== "all" && trend.platform !== platform) return false;
    if (sentiment !== "all" && trend.sentiment !== sentiment) return false;
    return true;
  });

  const sortedTrends = [...filteredTrends].sort((a, b) => {
    if (sortBy === "engagement") {
      return b.engagement - a.engagement;
    } else if (sortBy === "recent") {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs
          defaultValue="all"
          onValueChange={setPlatform}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="YOUTUBE">YouTube</TabsTrigger>
            <TabsTrigger value="REDDIT">Reddit</TabsTrigger>
            <TabsTrigger value="TWITTER">Twitter</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={sentiment} onValueChange={setSentiment}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiments</SelectItem>
              <SelectItem value="POSITIVE">Positive</SelectItem>
              <SelectItem value="NEUTRAL">Neutral</SelectItem>
              <SelectItem value="NEGATIVE">Negative</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Most Engagement</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedTrends.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No trends found with the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTrends.map((trend: any, i) => (
            <TrendCard key={i} {...trend} />
          ))}
        </div>
      )}
    </div>
  );
}
