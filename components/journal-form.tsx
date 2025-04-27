"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PenLine } from "lucide-react"
import type { JournalTemplate } from "@/types/templates"

interface JournalFormProps {
  onAddEntry: (content: string) => void
  template: JournalTemplate
}

export default function JournalForm({ onAddEntry, template }: JournalFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      onAddEntry(content)
      setContent("")
    } catch (error) {
      console.error("Error submitting entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          {template.name}
        </CardTitle>
        {template.description && <p className="text-sm text-muted-foreground">{template.description}</p>}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pb-4">
          <div className="space-y-4">
            {template.prompts && (
              <div className="space-y-2 mb-4">
                {template.prompts.map((prompt: string, index: number) => (
                  <div key={index} className="text-sm p-3 bg-muted/50 rounded-md border border-border/30">
                    {prompt}
                  </div>
                ))}
              </div>
            )}

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={template.placeholder || "Start writing..."}
              className="min-h-[200px] resize-none text-base leading-relaxed"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
