"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { generateJournalSummary, generateJournalMood, generateJournalSuggestion } from "@/lib/ai-service"

export async function getJournals() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { journals: { orderBy: { createdAt: "desc" } } },
  })

  return user?.journals || []
}

export async function createJournal(data: {
  title: string
  content?: string
  template?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  // Generate AI insights if content is provided
  let ai_summary = null
  let ai_mood = null
  let ai_mood_score = null
  let ai_suggestion = null

  if (data.content) {
    ai_summary = await generateJournalSummary(data.content)
    const moodData = await generateJournalMood(data.content)
    ai_mood = moodData.mood
    ai_mood_score = moodData.moodScore
    ai_suggestion = await generateJournalSuggestion(data.content)
  }

  return prisma.journal.create({
    data: {
      ...data,
      userId: user.id,
      ai_summary,
      ai_mood,
      ai_mood_score,
      ai_suggestion
    },
  })
}

export async function updateJournal(
  id: string,
  data: {
    title?: string
    content?: string
    template?: string
    ai_summary?: string
    ai_mood?: string
    ai_mood_score?: number
    ai_suggestion?: string
  },
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!journal || journal.user.clerkId !== userId) throw new Error("Unauthorized")

  // Re-generate AI insights if content is updated
  let updateData = { ...data }

  if (data.content) {
    updateData.ai_summary = await generateJournalSummary(data.content)
    const moodData = await generateJournalMood(data.content)
    updateData.ai_mood = moodData.mood
    updateData.ai_mood_score = moodData.moodScore
    updateData.ai_suggestion = await generateJournalSuggestion(data.content)
  }

  return prisma.journal.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteJournal(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!journal || journal.user.clerkId !== userId) throw new Error("Unauthorized")

  return prisma.journal.delete({
    where: { id },
  })
}
