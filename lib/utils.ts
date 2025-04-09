import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getRedditAccessToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID!;
  const secret = process.env.REDDIT_SECRET!;

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "MyApp/1.0.0 (by u/SubhadipSahaOfficial)",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    console.error("Failed to get Reddit token:", await response.text());
    return null;
  }

  const data = await response.json();
  return data.access_token;
}
