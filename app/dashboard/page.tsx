import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { TrendGrid } from "@/components/trend-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Get user's search history
  const searches = await prisma.search.findMany({
    where: {
      userId: session.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      trends: true,
    },
  });

  // Get user's comments
  const comments = await prisma.comment.findMany({
    where: {
      userId: session.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      trend: true,
    },
  });

  // Flatten trends from all searches
  const allTrends: any[] = searches.flatMap((search: any) => search.trends);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

        <Tabs defaultValue="trends">
          <TabsList className="mb-8">
            <TabsTrigger value="trends">Your Trends</TabsTrigger>
            <TabsTrigger value="searches">Search History</TabsTrigger>
            <TabsTrigger value="comments">Your Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            {allTrends.length > 0 ? (
              <TrendGrid trends={allTrends} />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No trends yet</h3>
                <p className="text-gray-600">
                  Search for topics to start discovering trends.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="searches">
            {searches.length > 0 ? (
              <div className="space-y-4">
                {searches.map((search) => (
                  <Card key={search.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        <a
                          href={`/search?q=${encodeURIComponent(search.query)}`}
                          className="hover:text-blue-600"
                        >
                          {search.query}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        {new Date(search.createdAt).toLocaleDateString()} •{" "}
                        {search.trends.length} trends found
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  No search history
                </h3>
                <p className="text-gray-600">
                  Your recent searches will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments">
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        <a
                          href={`/trend/${comment.trend.id}`}
                          className="hover:text-blue-600"
                        >
                          {comment.trend.title}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">{comment.content}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No comments yet</h3>
                <p className="text-gray-600">
                  Your comments on trends will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
