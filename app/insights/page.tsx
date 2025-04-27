"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { getJournals } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Calendar, LineChart } from "lucide-react"
import type { Entry } from "@/types/entry"

export default function InsightsPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    async function loadEntries() {
      if (isSignedIn) {
        try {
          const journals = await getJournals()
          setEntries(
            journals.map((journal) => ({
              id: journal.id,
              content: journal.content || journal.title,
              date: journal.createdAt,
              template: journal.template!,
              ai_summary: journal.ai_summary!,
              ai_mood: journal.ai_mood!,
              ai_mood_score: journal.ai_mood_score!,
              ai_suggestion: journal.ai_suggestion!,
            })),
          )
        } catch (error) {
          console.error("Failed to load journals:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [isSignedIn])

  if (!isSignedIn) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Insights</h1>
        <p className="text-muted-foreground mb-8">Sign in to view your journal insights</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Insights</h1>
        <p className="text-muted-foreground">Loading your insights...</p>
      </div>
    )
  }

  // Calculate mood stats
  const moodScores = entries.filter((e) => e.ai_mood_score !== undefined).map((e) => e.ai_mood_score as number)
  const averageMoodScore =
    moodScores.length > 0
      ? Math.round((moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length) * 10) / 10
      : 0

  // Group mood scores
  const moodDistribution = {
    high: entries.filter((e) => e.ai_mood_score !== undefined && e.ai_mood_score >= 8).length,
    medium: entries.filter((e) => e.ai_mood_score !== undefined && e.ai_mood_score >= 5 && e.ai_mood_score < 8).length,
    low: entries.filter((e) => e.ai_mood_score !== undefined && e.ai_mood_score < 5).length,
  }

  // Calculate template usage
  const templateCounts: Record<string, number> = {}
  entries.forEach((entry) => {
    const template = entry.template || "free-form"
    templateCounts[template] = (templateCounts[template] || 0) + 1
  })

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Insights</h1>
        <p className="text-muted-foreground">Discover patterns and trends from your journaling practice</p>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any journal entries yet.</p>
            <p className="text-sm">Start journaling to see insights and patterns in your writing.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Mood Analysis</CardTitle>
              </div>
              <CardDescription>Your emotional state over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{averageMoodScore}</p>
                  <p className="text-muted-foreground">Average Mood Score</p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex flex-col items-center p-2 bg-green-100 dark:bg-green-900/20 rounded-md">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {moodDistribution.high}
                      </span>
                      <span className="text-xs text-muted-foreground">High (8-10)</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-md">
                      <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {moodDistribution.medium}
                      </span>
                      <span className="text-xs text-muted-foreground">Medium (5-7)</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">{moodDistribution.low}</span>
                      <span className="text-xs text-muted-foreground">Low (1-4)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Journal Activity</CardTitle>
              </div>
              <CardDescription>Your journaling frequency and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{entries.length}</p>
                  <p className="text-muted-foreground">Total Entries</p>
                  <p className="mt-4 text-sm">You've been journaling for {Math.ceil(entries.length / 2)} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Template Usage</CardTitle>
              </div>
              <CardDescription>Which journal templates you use most frequently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(templateCounts).map(([template, count]) => (
                  <div key={template} className="flex flex-col items-center p-4 bg-muted/30 rounded-md">
                    <span className="text-xl font-bold">{count}</span>
                    <span className="text-sm text-muted-foreground text-center">
                      {template
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
