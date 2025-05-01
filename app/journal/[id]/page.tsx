import { notFound } from "next/navigation"
import { getJournalById, getUserCredits, processJournalWithAI } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export type paramsType = Promise<{ id: string }>

// This is an async Server Component
export default async function JournalPage({ params }: { params: paramsType }) {
  const { id } = await params
  const journal = await getJournalById(id)
  const credits = await getUserCredits()

  // Handle case where journal is not found or user is not authorized
  if (!journal) {
    notFound() // Renders the nearest not-found.tsx file or a default Next.js 404 page
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl font-bold">{journal.title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {format(new Date(journal.createdAt), "PPP")} {/* Format date nicely */}
            </span>
          </div>
          <CardDescription>
            Template: <Badge variant="outline">{journal.template || "N/A"}</Badge>
          </CardDescription>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {" "}
            {/* Use prose for nice text formatting */}
            <p>{journal.content}</p>
          </div>

          {/* Display AI Insights if available */}
          {(journal.ai_summary || journal.ai_mood || journal.ai_suggestion) && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI Insights</h3>
                {journal.ai_summary && (
                  <div>
                    <h4 className="font-medium mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground">{journal.ai_summary}</p>
                  </div>
                )}
                {journal.ai_mood && (
                  <div>
                    <h4 className="font-medium mb-1">Detected Mood</h4>
                    <p className="text-sm text-muted-foreground">
                      {journal.ai_mood} (Score: {journal.ai_mood_score?.toFixed(2) ?? "N/A"})
                    </p>
                  </div>
                )}
                {journal.ai_suggestion && (
                  <div>
                    <h4 className="font-medium mb-1">Suggestion</h4>
                    <p className="text-sm text-muted-foreground">{journal.ai_suggestion}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Show AI processing option if not already processed */}
          {!journal.aiProcessed && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium mb-1 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered insights for this journal entry (requires 1 credit)
                  </p>
                </div>
                {credits > 0 ? (
                  <form
                    action={async () => {
                      "use server"
                      await processJournalWithAI(id)
                    }}
                  >
                    <Button type="submit" size="sm">
                      Analyze with AI
                    </Button>
                  </form>
                ) : (
                  <Link href="/pricing">
                    <Button variant="outline" size="sm">
                      Get Credits
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {credits} {credits === 1 ? "credit" : "credits"} remaining
          </div>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Buy Credits
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
