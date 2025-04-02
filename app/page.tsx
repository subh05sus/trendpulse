import { getRecentSearches } from "@/lib/db"
import { SearchBar } from "@/components/search-bar"
import { RecentSearches } from "@/components/recent-searches"
import { TrendingTopics } from "@/components/trending-topics"
import { Navbar } from "@/components/navbar"

export default async function Home() {
  const recentSearches = await getRecentSearches(5)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover What People Are Saying Across Social Media</h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Aggregate trending discussions from YouTube, Reddit, and Twitter on any topic or product.
            </p>
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RecentSearches searches={recentSearches} />
              <TrendingTopics />
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Search Any Topic</h3>
                <p className="text-gray-600">Enter any topic, product, or trend you want to learn about.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Aggregate Results</h3>
                <p className="text-gray-600">We fetch trending discussions from YouTube, Reddit, and Twitter.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Insights</h3>
                <p className="text-gray-600">
                  View AI-generated summaries and filter results by platform or sentiment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <TrendingTopics />
                <span className="font-bold text-xl">TrendPulse</span>
              </div>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} TrendPulse. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

