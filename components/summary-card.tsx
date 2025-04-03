/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

type SummaryCardProps = {
  summary: string;
  query: string;
};

export function SummaryCard({ summary, query }: SummaryCardProps) {
  // Convert bullet points to an array for better rendering
  const bulletPoints = summary
    .split("\n")
    .filter(
      (line) =>
        line.trim().startsWith("•") ||
        line.trim().startsWith("-") ||
        line.trim().startsWith("*")
    )
    .map((line) => line.trim().replace(/^[•\-*]\s*/, ""));

  const hasBulletPoints = bulletPoints.length > 0;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="text-yellow-500" />
          <span>Key Insights about &quot;{query}&quot;</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasBulletPoints ? (
          <ul className="space-y-2 list-disc pl-5">
            {bulletPoints.map((point: any, index) => (
              <li key={index} className="text-gray-700">
                {point}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 whitespace-pre-line">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}
