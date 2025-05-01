"use client"

import { Suspense, useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { getJournals, createJournal, getUserCredits } from "@/lib/actions"
import type { Entry } from "@/types/entry"
import EntriesList from "@/components/entries-list"
import WelcomeScreen from "@/components/welcome-screen"
import { Separator } from "@/components/ui/separator"
import JournalTabs from "@/components/journal-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTemplate, setActiveTemplate] = useState("free-form")
  const [credits, setCredits] = useState<number | null>(null)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    async function loadData() {
      if (isSignedIn) {
        try {
          const [journals, userCredits] = await Promise.all([getJournals(), getUserCredits()])

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
              aiProcessed: journal.aiProcessed,
            })),
          )

          setCredits(userCredits)
        } catch (error) {
          console.error("Failed to load data:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isSignedIn])

  const addEntry = async (content: string) => {
    try {
      const newJournal = await createJournal({
        title: content.substring(0, 50),
        content,
        template: activeTemplate,
      })

      // Add the new entry to the state
      setEntries([
        {
          id: newJournal.id,
          content: newJournal.content || newJournal.title,
          date: newJournal.createdAt,
          template: newJournal.template!,
          ai_summary: newJournal.ai_summary!,
          ai_mood: newJournal.ai_mood!,
          ai_mood_score: newJournal.ai_mood_score!,
          ai_suggestion: newJournal.ai_suggestion!,
          aiProcessed: newJournal.aiProcessed,
        },
        ...entries,
      ])

      // Refresh credits after creating a journal
      const updatedCredits = await getUserCredits()
      setCredits(updatedCredits)
    } catch (error) {
      console.error("Failed to create journal entry:", error)
    }
  }

  if (!isSignedIn) {
    return <WelcomeScreen />
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Let's journal</h1>
        <p className="text-muted-foreground">Capture your thoughts, track your mood, and gain insights</p>
      </div>

      {credits !== null && credits === 0 && (
        <Alert className="mb-6 bg-muted/50">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle>No AI credits remaining</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <span>Purchase credits to unlock AI-powered insights for your journal entries.</span>
            <Link href="/pricing">
              <Button size="sm" variant="outline">
                Get Credits
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <JournalTabs activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} addEntry={addEntry} />
      </Suspense>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your journals</h2>
          <span className="text-sm text-muted-foreground">{entries.length} journals</span>
        </div>
        <Separator className="mb-6" />
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading your journal...</p>
        ) : (
          <EntriesList entries={entries} />
        )}
      </div>
    </div>
  )
}
