import { type NextRequest, NextResponse } from "next/server";
import { addComment } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { trendId, content } = await request.json();

    if (!trendId || !content) {
      return NextResponse.json(
        { error: "Trend ID and content are required" },
        { status: 400 }
      );
    }

    const comment = await addComment(session.user.id, trendId, content);

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
