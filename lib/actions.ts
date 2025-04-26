// lib/actions.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function getJournals() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { journals: true }
  })

  return user?.journals || []
}

export async function createJournal(data: { title: string, content?: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) throw new Error('User not found')

  return prisma.journal.create({
    data: {
      ...data,
      userId: user.id
    }
  })
}

export async function updateJournal(id: string, data: { title?: string, content?: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!journal || journal.user.clerkId !== userId) throw new Error('Unauthorized')

  return prisma.journal.update({
    where: { id },
    data
  })
}

export async function deleteJournal(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!journal || journal.user.clerkId !== userId) throw new Error('Unauthorized')

  return prisma.journal.delete({
    where: { id }
  })
}