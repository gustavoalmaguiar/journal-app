"use client"

import { Suspense, useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { getJournals, createJournal } from "@/lib/actions"
import type { Entry } from "@/types/entry"
import EntriesList from "@/components/entries-list"
import WelcomeScreen from "@/components/welcome-screen"
import { Separator } from "@/components/ui/separator"
import JournalTabs from "@/components/journal-tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTemplate, setActiveTemplate] = useState("free-form")
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
        },
        ...entries,
      ])
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
        <h1 className="text-3xl font-bold mb-2">Let’s journal</h1>
        <p className="text-muted-foreground">Capture your thoughts, track your mood, and gain insights</p>
      </div>

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
