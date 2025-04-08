import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { TrendCardSkeleton } from "@/components/trend-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>
        <SearchResultsSkeleton />
      </main>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-1/3" />

      {/* Summary card skeleton */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Filter controls skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex flex-col sm:flex-row gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Grid of trend cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <TrendCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

