import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { BookOpenText, Sparkles, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WelcomeScreen() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to journal</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personal journaling companion with AI-powered insights and templates
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <BookOpenText className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Smart Journaling</CardTitle>
            <CardDescription>Multiple templates to guide your writing and reflection</CardDescription>
          </CardHeader>
          <CardContent>
            Choose from daily reflections, gratitude journals, goal tracking, and more to structure your thoughts.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Sparkles className="h-10 w-10 text-primary mb-2" />
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Gain deeper understanding of your thoughts and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            Our AI analyzes your entries to provide personalized insights and suggestions for personal growth.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Mood Tracking</CardTitle>
            <CardDescription>Visualize your emotional journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            Automatic sentiment analysis helps you track your mood patterns and emotional well-being.
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <SignUpButton mode="modal">
          <Button size="lg" className="px-8">
            Get Started
          </Button>
        </SignUpButton>
        <SignInButton mode="modal">
          <Button variant="ghost" size="lg">
            Already have an account? Sign in
          </Button>
        </SignInButton>
      </div>
    </div>
  )
}
