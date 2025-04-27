import { notFound } from "next/navigation"
import { getJournalById } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type paramsType = Promise<{ id: string }>

// This is an async Server Component
export default async function JournalPage({ params }: { params: paramsType }) {
  const { id } = await params;
  const journal = await getJournalById(id);

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
          <CardDescription>Template: <Badge variant="outline">{journal.template || "N/A"}</Badge></CardDescription>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          <div className="prose dark:prose-invert max-w-none"> {/* Use prose for nice text formatting */}
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
                      {journal.ai_mood} (Score: {journal.ai_mood_score?.toFixed(2) ?? 'N/A'})
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
        </CardContent>
      </Card>
    </div>
  )
}