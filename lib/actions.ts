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

export async function getJournalById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: { user: true },
  })

  // Ensure the journal exists and belongs to the authenticated user
  if (!journal || journal.user.clerkId !== userId) {
    return null // Or throw an error, depending on desired behavior for not found/unauthorized
  }

  return journal
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

  // Create journal without AI processing initially
  const journal = await prisma.journal.create({
    data: {
      ...data,
      userId: user.id,
      aiProcessed: false,
    },
  })

  // Check if user has credits and process AI if they do
  if (user.credits > 0 && data.content) {
    await processJournalWithAI(journal.id)
  }

  return journal
}

export async function processJournalWithAI(journalId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Get the user and journal
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const journal = await prisma.journal.findUnique({
    where: { id: journalId },
    include: { user: true },
  })

  if (!journal || journal.user.clerkId !== userId) throw new Error("Unauthorized")

  // Check if user has credits
  if (user.credits <= 0) {
    throw new Error("Insufficient credits")
  }

  // Check if journal has already been processed
  if (journal.aiProcessed) {
    return journal
  }

  // Generate AI insights
  const content = journal.content || journal.title
  const ai_summary = await generateJournalSummary(content)
  const moodData = await generateJournalMood(content)
  const ai_mood = moodData.mood
  const ai_mood_score = moodData.moodScore
  const ai_suggestion = await generateJournalSuggestion(content)

  // Deduct credits
  await prisma.user.update({
    where: { id: user.id },
    data: { credits: { decrement: 1 } },
  })

  // Update journal with AI insights
  return prisma.journal.update({
    where: { id: journalId },
    data: {
      ai_summary,
      ai_mood,
      ai_mood_score,
      ai_suggestion,
      aiProcessed: true,
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

  // Update journal without AI processing
  const updatedJournal = await prisma.journal.update({
    where: { id },
    data: {
      ...data,
      // Reset AI processing if content changes
      ...(data.content ? { aiProcessed: false } : {}),
    },
  })

  // If content was updated, check if user has credits and process AI
  if (data.content) {
    const user = await prisma.user.findUnique({
      where: { id: journal.user.id },
    })

    if (user && user.credits > 0) {
      return processJournalWithAI(id)
    }
  }

  return updatedJournal
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

export async function getUserCredits() {
  const { userId } = await auth()
  if (!userId) return 0

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { credits: true },
  })

  return user?.credits || 0
}

export async function createCheckoutSession(priceId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

  // Create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId: user.id,
    },
  })

  // Create a pending transaction
  await prisma.transaction.create({
    data: {
      userId: user.id,
      amount: getAmountFromPriceId(priceId),
      credits: getCreditsFromPriceId(priceId),
      stripeId: session.id,
      status: "pending",
    },
  })

  return { sessionId: session.id, url: session.url }
}

// Helper function to get amount from price ID
function getAmountFromPriceId(priceId: string): number {
  const prices = {
    price_1RJwso4WVR4vWMuZa3BUEkZ1: 5.99,
    price_1RJyGA4WVR4vWMuZ1fszZtWH: 9.99,
    price_1RJyHU4WVR4vWMuZHnPeNBYy: 19.99,
  }
  return prices[priceId as keyof typeof prices] || 0
}

// Helper function to get credits from price ID
function getCreditsFromPriceId(priceId: string): number {
  const credits = {
    price_1RJwso4WVR4vWMuZa3BUEkZ1: 10,
    price_1RJyGA4WVR4vWMuZ1fszZtWH: 25,
    price_1RJyHU4WVR4vWMuZHnPeNBYy: 60,
  }
  return credits[priceId as keyof typeof credits] || 0
}
