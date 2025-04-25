"use client"

import EntriesList from "@/components/entries-list";
import JournalForm from "@/components/journal-form";
import { Entry } from "@/types/entry";
import { useState, useEffect } from "react";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);

  // Load entries from localStorage on initial render
  useEffect(() => {
    const savedEntries = localStorage.getItem("journal-entries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("journal-entries", JSON.stringify(entries))
  }, [entries])

  const addEntry = (content: string) => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Journal App</h1>
          <p className="text-gray-600 dark:text-gray-300">Capture your thoughts, ideas, and moments</p>
        </header>

        <JournalForm onAddEntry={addEntry} />

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Entries</h2>
          <EntriesList entries={entries} />
        </div>
      </div>
    </main>
  )
}
