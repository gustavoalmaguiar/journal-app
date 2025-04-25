"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PenLine } from "lucide-react"

interface JournalFormProps {
  onAddEntry: (content: string) => void
}

export default function JournalForm({ onAddEntry }: JournalFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    // Just learned that preventDefault is used to prevent the refresh.
    // #LearningOfTheDay #React #JavaScript
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    // Yes, you're seeing this delay. Feels smoother to have it.
    setTimeout(() => {
      onAddEntry(content)
      setContent("")
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Card className="shadow-md border-0">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <PenLine className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-medium">What's on your mind?</h2>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your journal entry here..."
            className="min-h-[150px] resize-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-600"
            required
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition-all"
            >
              {isSubmitting ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
