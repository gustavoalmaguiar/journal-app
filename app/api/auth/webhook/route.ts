import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json()

  // Handle user creation
  if (payload.type === 'user.created') {
    const { id: clerkId, email_addresses, primary_email_address_id } = payload.data

    const primaryEmail = email_addresses.find(
      (email) => email.id === primary_email_address_id
    )

    if (!primaryEmail) {
      console.error('No primary email found for user', clerkId)
      return new Response('No primary email found', { status: 400 })
    }

    try {
      // Create a new user in the database
      const user = await prisma.user.create({
        data: {
          clerkId,
          email: primaryEmail.email_address
        }
      })

      console.log('User created:', user)
      return new Response('User created', { status: 201 })
    } catch (error) {
      console.error('Error creating user:', error)
      return new Response('Error creating user', { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}