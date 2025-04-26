"use client"

import EntriesList from "@/components/entries-list";
import JournalForm from "@/components/journal-form";
import { useEffect, useState } from "react";
import { getJournals, createJournal } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { Entry } from "@/types/entry";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    async function loadEntries() {
      if (isSignedIn) {
        try {
          const journals = await getJournals();
          setEntries(journals.map(journal => ({
            id: journal.id,
            content: journal.content || journal.title,
            date: journal.createdAt,
          })));
        } catch (error) {
          console.error("Failed to load journals:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    loadEntries();
  }, [isSignedIn]);

  const addEntry = async (content: string) => {
    try {
      const newJournal = await createJournal({
        title: content.substring(0, 50),
        content
      });

      // Add the new entry to the state
      setEntries([{
        id: newJournal.id,
        content: newJournal.content || newJournal.title,
        date: newJournal.createdAt,
      }, ...entries]);
    } catch (error) {
      console.error("Failed to create journal entry:", error);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Journal App</h1>
          <p className="text-gray-600 dark:text-gray-300">Capture your thoughts, ideas, and moments</p>
        </header>

        {isSignedIn ? (
          <>
            <JournalForm onAddEntry={addEntry} />

            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Entries</h2>
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading your entries...</p>
              ) : (
                <EntriesList entries={entries} />
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
              Please sign in to view and create journal entries
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
