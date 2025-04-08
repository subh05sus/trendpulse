"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Reset loading state when navigation completes (detected by pathname or searchParams changing)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      
      // If user is logged in, call the search API directly to ensure the search is saved
      if (session?.user?.id) {
        fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).catch(error => console.error('Error saving search:', error));
      }
      
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for any topic or product..."
          className="w-full h-14 px-5 pr-16 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
          aria-label="Search"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <Search size={24} />
          )}
        </button>
      </div>
    </form>
  );
}
