/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface TrendingTopic {
  id: number;
  name: string;
  count: number;
}

export function TrendingTopics() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingTopics() {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/trending-topics");
        const data = await response.json();
        setTrendingTopics(data);
      } catch (error) {
        console.error("Failed to fetch trending topics:", error);
        // Fallback data in case the API fails
        setTrendingTopics([
          { id: 1, name: "Apple Vision Pro", count: 1243 },
          { id: 2, name: "Nvidia RTX 4090", count: 982 },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingTopics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp size={18} />
            <span>Trending Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin" size={24} />
        </CardContent>
      </Card>
    );
  }

  if (trendingTopics.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp size={18} />
            <span>Trending Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-4">
          No trending topics available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp size={18} />
          <span>Trending Topics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {trendingTopics.map((topic: any) => (
            <li key={topic.id}>
              <Link
                href={`/search?q=${encodeURIComponent(topic.name)}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="font-medium dark:text-gray-200">{topic.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {topic.count.toLocaleString()} searches
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
