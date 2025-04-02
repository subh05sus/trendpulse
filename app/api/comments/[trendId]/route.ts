import { type NextRequest, NextResponse } from "next/server"
import { getCommentsByTrendId } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { trendId: string } }) {
  try {
    const trendId = params.trendId

    if (!trendId) {
      return NextResponse.json({ error: "Trend ID is required" }, { status: 400 })
    }

    const comments = await getCommentsByTrendId(trendId)

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

