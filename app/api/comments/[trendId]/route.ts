import { NextRequest, NextResponse } from "next/server";
import { getCommentsByTrendId } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: any // Suppress type check by using `any`
) {
  try {
    const trendId = (context as { params: { trendId: string } }).params.trendId;

    if (!trendId) {
      return NextResponse.json(
        { error: "Trend ID is required" },
        { status: 400 }
      );
    }

    const comments = await getCommentsByTrendId(trendId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
