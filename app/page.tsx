/* eslint-disable react/no-unescaped-entities */
import { getRecentSearches } from "@/lib/db";
import { SearchBar } from "@/components/search-bar";
import { RecentSearches } from "@/components/recent-searches";
import { TrendingTopics } from "@/components/trending-topics";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ArrowRight, TrendingUp, Twitter } from "lucide-react";

export default async function Home() {
  const recentSearches = await getRecentSearches(5);

  // Convert Date objects to strings
  const formattedSearches = recentSearches.map((search) => ({
    ...search,
    createdAt: search.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background"></div>

          {/* Animated background circles */}
          <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block mb-6 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              Discover what's trending across social media
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Your Social Media Pulse in One Place
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Aggregate trending discussions from YouTube, Reddit, and Twitter
              on any topic or product with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <div className="w-full max-w-xl">
                <SearchBar />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Popular searches:</span>
              <Link
                href="/search?q=AI"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                AI
              </Link>
              <span>•</span>
              <Link
                href="/search?q=iPhone"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                iPhone
              </Link>
              <span>•</span>
              <Link
                href="/search?q=Tesla"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Tesla
              </Link>
              <span>•</span>
              <Link
                href="/search?q=Crypto"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Crypto
              </Link>
              <span>•</span>
              <Link
                href="/about"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4 inline" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                All Your Social Platforms in One Place
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                TrendPulse aggregates content from multiple platforms to give
                you a comprehensive view of what's trending.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32px"
                    width="32px"
                    version="1.1"
                    id="Layer_1"
                    viewBox="0 0 461.001 461.001"
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        style={{ fill: "#F61C0D" }}
                        d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728   c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137   C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607   c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"
                      />
                    </g>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">YouTube</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover trending videos, reviews, and discussions from the
                  world's largest video platform.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  {/* <MessageSquare className="h-8 w-8 text-orange-600 dark:text-orange-400" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 800 800"
                    width="32"
                    height="32"
                  >
                    <circle cx="400" cy="400" fill="#ff4500" r="400" />
                    <path
                      d="M666.8 400c.08 5.48-.6 10.95-2.04 16.24s-3.62 10.36-6.48 15.04c-2.85 4.68-6.35 8.94-10.39 12.65s-8.58 6.83-13.49 9.27c.11 1.46.2 2.93.25 4.4a107.268 107.268 0 0 1 0 8.8c-.05 1.47-.14 2.94-.25 4.4 0 89.6-104.4 162.4-233.2 162.4S168 560.4 168 470.8c-.11-1.46-.2-2.93-.25-4.4a107.268 107.268 0 0 1 0-8.8c.05-1.47.14-2.94.25-4.4a58.438 58.438 0 0 1-31.85-37.28 58.41 58.41 0 0 1 7.8-48.42 58.354 58.354 0 0 1 41.93-25.4 58.4 58.4 0 0 1 46.52 15.5 286.795 286.795 0 0 1 35.89-20.71c12.45-6.02 25.32-11.14 38.51-15.3s26.67-7.35 40.32-9.56 27.45-3.42 41.28-3.63L418 169.6c.33-1.61.98-3.13 1.91-4.49.92-1.35 2.11-2.51 3.48-3.4 1.38-.89 2.92-1.5 4.54-1.8 1.61-.29 3.27-.26 4.87.09l98 19.6c9.89-16.99 30.65-24.27 48.98-17.19s28.81 26.43 24.71 45.65c-4.09 19.22-21.55 32.62-41.17 31.61-19.63-1.01-35.62-16.13-37.72-35.67L440 186l-26 124.8c13.66.29 27.29 1.57 40.77 3.82a284.358 284.358 0 0 1 77.8 24.86A284.412 284.412 0 0 1 568 360a58.345 58.345 0 0 1 29.4-15.21 58.361 58.361 0 0 1 32.95 3.21 58.384 58.384 0 0 1 25.91 20.61A58.384 58.384 0 0 1 666.8 400zm-396.96 55.31c2.02 4.85 4.96 9.26 8.68 12.97 3.71 3.72 8.12 6.66 12.97 8.68A40.049 40.049 0 0 0 306.8 480c16.18 0 30.76-9.75 36.96-24.69 6.19-14.95 2.76-32.15-8.68-43.59s-28.64-14.87-43.59-8.68c-14.94 6.2-24.69 20.78-24.69 36.96 0 5.25 1.03 10.45 3.04 15.31zm229.1 96.02c2.05-2 3.22-4.73 3.26-7.59.04-2.87-1.07-5.63-3.07-7.68s-4.73-3.22-7.59-3.26c-2.87-.04-5.63 1.07-7.94 2.8a131.06 131.06 0 0 1-19.04 11.35 131.53 131.53 0 0 1-20.68 7.99c-7.1 2.07-14.37 3.54-21.72 4.39-7.36.85-14.77 1.07-22.16.67-7.38.33-14.78.03-22.11-.89a129.01 129.01 0 0 1-21.64-4.6c-7.08-2.14-13.95-4.88-20.56-8.18s-12.93-7.16-18.89-11.53c-2.07-1.7-4.7-2.57-7.38-2.44s-5.21 1.26-7.11 3.15c-1.89 1.9-3.02 4.43-3.15 7.11s.74 5.31 2.44 7.38c7.03 5.3 14.5 9.98 22.33 14s16 7.35 24.4 9.97 17.01 4.51 25.74 5.66c8.73 1.14 17.54 1.53 26.33 1.17 8.79.36 17.6-.03 26.33-1.17A153.961 153.961 0 0 0 476.87 564c7.83-4.02 15.3-8.7 22.33-14zm-7.34-68.13c5.42.06 10.8-.99 15.81-3.07 5.01-2.09 9.54-5.17 13.32-9.06s6.72-8.51 8.66-13.58A39.882 39.882 0 0 0 532 441.6c0-16.18-9.75-30.76-24.69-36.96-14.95-6.19-32.15-2.76-43.59 8.68s-14.87 28.64-8.68 43.59c6.2 14.94 20.78 24.69 36.96 24.69z"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Reddit</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find the most engaging discussions and opinions from Reddit's
                  diverse communities.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Twitter className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Twitter</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay updated with real-time conversations and trending topics
                  from Twitter.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RecentSearches searches={formattedSearches} />
              <TrendingTopics />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                TrendPulse makes it easy to discover what people are saying
                across social media platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center relative z-10">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Search Any Topic
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter any topic, product, or trend you want to learn about.
                  </p>
                </div>
                <div className="absolute top-1/2 left-full w-16 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block -translate-y-1/2"></div>
              </div>

              <div className="relative">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center relative z-10">
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Aggregate Results
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We fetch trending discussions from YouTube, Reddit, and
                    Twitter.
                  </p>
                </div>
                <div className="absolute top-1/2 left-full w-16 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block -translate-y-1/2"></div>
              </div>

              <div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Get Insights</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    View AI-generated summaries and filter results by platform
                    or sentiment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-xl">TrendPulse</span>
              </div>
              <p className="text-gray-400 mb-4">
                Discover what people are saying across social media platforms.
              </p>
              <p className="text-gray-400">
                © {new Date().getFullYear()} TrendPulse. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
