import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

type RecentSearch = {
  id: string
  query: string
  createdAt: string
  trends: Array<{
    id: string
    platform: "YOUTUBE" | "REDDIT" | "TWITTER"
  }>
}

type RecentSearchesProps = {
  searches: RecentSearch[]
}

export function RecentSearches({ searches }: RecentSearchesProps) {
  if (!searches || searches.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock size={18} />
          <span>Recent Searches</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {searches.map((search) => {
            // Count platforms
            const platforms = search.trends.reduce(
              (acc, trend) => {
                acc[trend.platform.toLowerCase() as "youtube" | "reddit" | "twitter"] += 1
                return acc
              },
              { youtube: 0, reddit: 0, twitter: 0 },
            )

            return (
              <li key={search.id}>
                <Link
                  href={`/search?q=${encodeURIComponent(search.query)}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">{search.query}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {platforms.youtube > 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">YT: {platforms.youtube}</span>
                    )}
                    {platforms.reddit > 0 && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                        RD: {platforms.reddit}
                      </span>
                    )}
                    {platforms.twitter > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        TW: {platforms.twitter}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

