import { formatDistanceToNow } from "date-fns"
import { ExternalLink, ThumbsUp, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type TrendCardProps = {
  id: string
  title: string
  content: string
  url: string
  platform: "YOUTUBE" | "REDDIT" | "TWITTER"
  authorName: string | null
  publishedAt: Date
  engagement: number
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE"
}

export function TrendCard({
  id,
  title,
  content,
  url,
  platform,
  authorName,
  publishedAt,
  engagement,
  sentiment,
}: TrendCardProps) {
  const platformColors = {
    YOUTUBE: "bg-red-100 text-red-800",
    REDDIT: "bg-orange-100 text-orange-800",
    TWITTER: "bg-blue-100 text-blue-800",
  }

  const sentimentColors = {
    POSITIVE: "bg-green-100 text-green-800",
    NEUTRAL: "bg-gray-100 text-gray-800",
    NEGATIVE: "bg-red-100 text-red-800",
  }

  console.log("TrendCard props:", {
    id,
    title,
    content,
    url,
    platform,
    authorName,
    publishedAt,
    engagement,
    sentiment,
  }
  )

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <Badge className={platformColors[platform]} variant="outline">
            {platform.charAt(0) + platform.slice(1).toLowerCase()}
          </Badge>
          <Badge className={sentimentColors[sentiment]} variant="outline">
            {sentiment.charAt(0) + sentiment.slice(1).toLowerCase()}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-4">{content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 pt-2 border-t">
        <div className="flex justify-between w-full text-sm text-gray-500">
          <span>{authorName || "Unknown author"}</span>
          <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <ThumbsUp size={16} />
            <span>{engagement.toLocaleString()} engagement</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/trend/${id}`} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
              <MessageSquare size={16} />
              <span>Discuss</span>
            </Link>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              <ExternalLink size={16} />
              <span>View</span>
            </a>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

