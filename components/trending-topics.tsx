import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

// This would typically come from a backend service that tracks popular searches
const trendingTopics = [
  { id: 1, name: "Apple Vision Pro", count: 1243 },
  { id: 2, name: "Nvidia RTX 4090", count: 982 },
  { id: 3, name: "Tesla Cybertruck", count: 876 },
  { id: 4, name: "PlayStation 5 Pro", count: 754 },
  { id: 5, name: "iPhone 15 Pro", count: 621 },
]

export function TrendingTopics() {
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
          {trendingTopics.map((topic) => (
            <li key={topic.id}>
              <Link
                href={`/search?q=${encodeURIComponent(topic.name)}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">{topic.name}</span>
                <span className="text-sm text-gray-500">{topic.count.toLocaleString()} searches</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

