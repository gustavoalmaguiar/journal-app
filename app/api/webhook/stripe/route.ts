import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  console.log("Stripe webhook received")
  const body = await req.text()
  console.log("Body:", body)
  const signature = (await headers()).get("stripe-signature") as string
  console.log("Signature:", signature)

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    console.log("Session:", session)
    // Find the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { stripeId: session.id },
      include: { user: true },
    })
    console.log("Transaction:", transaction)
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "completed" },
    })
    console.log("Transaction updated")
    // Add credits to user
    await prisma.user.update({
      where: { id: transaction.userId },
      data: { credits: { increment: transaction.credits } },
    })
    console.log("Credits added to user")
  }

  return NextResponse.json({ received: true })
}
