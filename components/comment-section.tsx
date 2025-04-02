"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"

type Comment = {
  id: string
  content: string
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
}

export function CommentSection({ trendId }: { trendId: string }) {
  const { data: session, status } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchComments() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/comments/${trendId}`)
        if (response.ok) {
          const data = await response.json()
          setComments(data)
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [trendId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trendId,
          content: newComment,
        }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([
          {
            ...comment,
            user: {
              name: session.user.name,
              image: session.user.image,
            },
          },
          ...comments,
        ])
        setNewComment("")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Discussion</h2>

      {status === "authenticated" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      ) : status === "loading" ? (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">Please sign in to join the discussion</p>
          <Button variant="outline" className="mt-2" asChild>
            <a href="/api/auth/signin">Sign In</a>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-lg border">
              <Avatar>
                <AvatarImage src={comment.user.image || undefined} />
                <AvatarFallback>{comment.user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{comment.user.name || "Anonymous"}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

