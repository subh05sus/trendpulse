import { type NextRequest, NextResponse } from "next/server";
import { aggregateTrends } from "@/lib/trend-aggregator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    const results = await aggregateTrends(query, userId);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
