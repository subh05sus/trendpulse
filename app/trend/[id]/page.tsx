import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { CommentSection } from "@/components/comment-section"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

type TrendPageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: TrendPageProps): Promise<Metadata> {
  const trend = await prisma.trend.findUnique({
    where: { id: params.id },
  })

  if (!trend) {
    return {
      title: "Trend Not Found - TrendPulse",
    }
  }

  return {
    title: `${trend.title} - TrendPulse`,
    description: trend.content.substring(0, 160),
  }
}

export default async function TrendPage({ params }: TrendPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<TrendDetailSkeleton />}>
          <TrendDetail id={params.id} />
        </Suspense>
      </main>
    </div>
  )
}

async function TrendDetail({ id }: { id: string }) {
  const trend = await prisma.trend.findUnique({
    where: { id },
    include: {
      search: true,
    },
  })

  if (!trend) {
    notFound()
  }

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={platformColors[trend.platform]} variant="outline">
            {trend.platform.charAt(0) + trend.platform.slice(1).toLowerCase()}
          </Badge>
          <Badge className={sentimentColors[trend.sentiment]} variant="outline">
            {trend.sentiment.charAt(0) + trend.sentiment.slice(1).toLowerCase()}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold mb-4">{trend.title}</h1>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <div>
            <span>By {trend.authorName || "Unknown author"}</span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(trend.publishedAt), { addSuffix: true })}</span>
          </div>
          <div>
            <a
              href={trend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink size={16} />
              <span>View Original</span>
            </a>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{trend.content}</p>
        </div>
      </div>

      <div className="mt-12">
        <CommentSection trendId={trend.id} />
      </div>
    </div>
  )
}

function TrendDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="h-10 w-3/4 mb-4" />

        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-32 w-full mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

