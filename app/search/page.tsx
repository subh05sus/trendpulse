import { Suspense } from "react";
// import type { Metadata } from "next"
import { notFound } from "next/navigation";
import { aggregateTrends } from "@/lib/trend-aggregator";
import { SearchBar } from "@/components/search-bar";
import { TrendGrid } from "@/components/trend-grid";
import { SummaryCard } from "@/components/summary-card";
import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

// type SearchPageProps = {
//   searchParams: { q?: string };
// };

// export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
//   const query = searchParams.q

//   if (!query) {
//     return {
//       title: "Search - TrendPulse",
//     }
//   }

//   return {
//     title: `${query} - TrendPulse Search`,
//     description: `Discover trending discussions about ${query} from YouTube, Reddit, and Twitter.`,
//   }
// }

export default async function SearchPage({ searchParams }: any) {
  const query = searchParams.q;

  if (!query) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </main>
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const results = await aggregateTrends(query);

  if (!results || !results.allTrends || results.allTrends.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No results found</h2>
        <p className="text-gray-600">
          We couldn&apos;t find any trending discussions for &quot;{query}
          &quot;. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Results for &quot;{query}&quot;</h1>

      <SummaryCard summary={results.summary} query={query} />

      <TrendGrid trends={results.allTrends} />
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-1/3" />

      <Skeleton className="h-64 w-full" />

      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
