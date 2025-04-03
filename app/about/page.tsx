import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About TrendPulse</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              TrendPulse was created to help people discover what&apos;s being
              said across social media platforms about any topic or product. In
              today&apos;s fragmented social media landscape, it&apos;s
              difficult to get a comprehensive view of public opinion without
              visiting multiple platforms.
            </p>
            <p className="text-gray-700">
              We aggregate trending discussions from YouTube, Reddit, and
              Twitter to provide you with a holistic view of what people are
              saying, complete with AI-generated summaries to help you quickly
              understand the key takeaways.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">1. Data Collection</h3>
                <p className="text-gray-700">
                  When you search for a topic, we fetch relevant content from
                  YouTube, Reddit, and Twitter using their respective APIs. We
                  look for trending discussions, reviews, and opinions related
                  to your search query.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">
                  2. Sentiment Analysis
                </h3>
                <p className="text-gray-700">
                  We use advanced AI to analyze the sentiment of each piece of
                  content, categorizing it as positive, neutral, or negative.
                  This helps you quickly identify the overall sentiment around
                  your topic of interest.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">
                  3. Trend Aggregation
                </h3>
                <p className="text-gray-700">
                  We combine all the data and present it in an easy-to-digest
                  format, allowing you to filter by platform, sentiment, or
                  engagement level. This gives you a comprehensive view of the
                  conversation happening across social media.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">
                  4. AI Summarization
                </h3>
                <p className="text-gray-700">
                  Our AI generates concise summaries of the key takeaways from
                  all the content, saving you time and helping you understand
                  the main points without having to read through everything.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
            <p className="text-gray-700 mb-4">
              TrendPulse is built using modern web technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Next.js for the frontend and API routes</li>
              <li>PostgreSQL database for storing trend data</li>
              <li>Redis for caching frequent searches</li>
              <li>
                Gemini&apos;s generative models for sentiment analysis and
                summarization
              </li>
              <li>YouTube, Reddit, and Twitter APIs for data collection</li>
            </ul>
            <p className="text-gray-700">
              We&apos;re constantly improving our platform to provide you with
              the most accurate and up-to-date information about what&apos;s
              trending across social media.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © {new Date().getFullYear()} TrendPulse. All rights reserved.
              </p>
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
  );
}
