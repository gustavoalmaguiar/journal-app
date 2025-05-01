"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap } from "lucide-react"
import { getUserCredits, createCheckoutSession } from "@/lib/actions"
import { toast } from "sonner"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PricingPlan {
  id: string
  name: string
  priceId: string
  price: string
  credits: number
  description: string
  features: string[]
  popular?: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceId: "price_1RJwso4WVR4vWMuZa3BUEkZ1",
    price: "$5.99",
    credits: 10,
    description: "Perfect for casual journaling",
    features: ["10 AI analysis credits", "Journal summaries", "Mood detection", "Personalized suggestions"],
  },
  {
    id: "popular",
    name: "Popular",
    priceId: "price_1RJyGA4WVR4vWMuZ1fszZtWH",
    price: "$9.99",
    credits: 25,
    description: "Best value for regular journaling",
    features: [
      "25 AI analysis credits",
      "Journal summaries",
      "Mood detection",
      "Personalized suggestions",
      "Priority processing",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    priceId: "price_1RJyHU4WVR4vWMuZHnPeNBYy",
    price: "$19.99",
    credits: 60,
    description: "For dedicated journaling practice",
    features: [
      "60 AI analysis credits",
      "Journal summaries",
      "Mood detection",
      "Personalized suggestions",
      "Priority processing",
      "Advanced insights",
    ],
  },
]

export default function PricingPage() {
  const [credits, setCredits] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const { isSignedIn } = useAuth()
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const canceled = searchParams.get("canceled")

  useEffect(() => {
    async function loadUserCredits() {
      if (isSignedIn) {
        try {
          const userCredits = await getUserCredits()
          setCredits(userCredits)
        } catch (error) {
          console.error("Failed to load user credits:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    loadUserCredits()
  }, [isSignedIn])

  useEffect(() => {
    if (success) {
      toast.success("Payment successful!", {
        description: "Your credits have been added to your account.",
      })
    }
    if (canceled) {
      toast.error("Payment canceled", {
        description: "Your payment was canceled. No credits were added.",
      })
    }
  }, [success, canceled])

  const handleCheckout = async (priceId: string) => {
    if (!isSignedIn) {
      toast.error("Please sign in to purchase credits")
      return
    }

    setCheckoutLoading(priceId)
    try {
      const { url } = await createCheckoutSession(priceId)
      window.location.href = url
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast.error("Failed to create checkout session")
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI Credits</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Purchase credits to unlock AI-powered insights for your journal entries
        </p>
        {isSignedIn && !isLoading && (
          <div className="mt-6 inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>
              You have <span className="font-bold">{credits} credits</span> remaining
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-primary shadow-md relative" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                <span className="text-2xl font-bold">{plan.price}</span>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-bold">{plan.credits} AI credits</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleCheckout(plan.priceId)}
                className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                disabled={checkoutLoading === plan.priceId || !isSignedIn}
              >
                {checkoutLoading === plan.priceId
                  ? "Processing..."
                  : isSignedIn
                    ? "Buy Credits"
                    : "Sign in to Purchase"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted/30 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How AI Credits Work</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">1. Purchase Credits</h3>
            <p className="text-sm text-muted-foreground">Choose a credit package that fits your journaling needs.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">2. Journal as Usual</h3>
            <p className="text-sm text-muted-foreground">Write your journal entries as you normally would.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">3. Get AI Insights</h3>
            <p className="text-sm text-muted-foreground">
              Each time AI analyzes an entry, one credit is used from your balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
