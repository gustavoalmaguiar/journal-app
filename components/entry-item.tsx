"use client"

import { formatDistanceToNow, format } from "date-fns"
import type { Entry } from "@/types/entry"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, MoreHorizontal, BookOpen, Lightbulb, Calendar, Trash2, Loader2, Zap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { journalTemplates } from "@/types/templates"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { deleteJournal, processJournalWithAI, getUserCredits } from "@/lib/actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EntryItemProps {
  entry: Entry
}

export default function EntryItem({ entry }: EntryItemProps) {
  const [showInsights, setShowInsights] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const formattedDate = formatDistanceToNow(new Date(entry.date), {
    addSuffix: true,
  })

  const exactDate = format(new Date(entry.date), "PPP 'at' p")

  const templateInfo = entry.template ? journalTemplates[entry.template] : journalTemplates["free-form"]

  const getMoodColor = (score?: number) => {
    if (!score) return "bg-gray-200 dark:bg-gray-700"
    if (score >= 8) return "bg-green-500"
    if (score >= 6) return "bg-emerald-400"
    if (score >= 5) return "bg-yellow-400"
    if (score >= 3) return "bg-orange-400"
    return "bg-red-500"
  }

  const getMoodEmoji = (score?: number) => {
    if (!score) return "😐"
    if (score >= 8) return "😄"
    if (score >= 6) return "🙂"
    if (score >= 5) return "😐"
    if (score >= 3) return "🙁"
    return "😞"
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteJournal(entry.id)
      toast.success("Entry deleted successfully", {
        description: "Your journal entry has been permanently removed",
        position: "bottom-center",
      })
    } catch (error) {
      toast.error("Failed to delete entry", {
        description: "There was a problem deleting your entry. Please try again.",
        position: "bottom-center",
      })
      console.error(error)
    } finally {
      setShowDeleteDialog(false)
      setIsDeleting(false)
    }
  }

  const handleProcessWithAI = async () => {
    try {
      // Check user credits first
      const credits = await getUserCredits()
      setUserCredits(credits)

      if (credits <= 0) {
        toast.error("Insufficient credits", {
          description: "Please purchase credits to use AI features",
          action: {
            label: "Buy Credits",
            onClick: () => (window.location.href = "/pricing"),
          },
        })
        return
      }

      setIsProcessing(true)
      await processJournalWithAI(entry.id)

      // Refresh the page to show updated entry with AI insights
      window.location.reload()

      toast.success("AI analysis complete", {
        description: "Your journal entry has been analyzed by AI",
      })
    } catch (error: any) {
      if (error.message === "Insufficient credits") {
        toast.error("Insufficient credits", {
          description: "Please purchase credits to use AI features",
          action: {
            label: "Buy Credits",
            onClick: () => (window.location.href = "/pricing"),
          },
        })
      } else {
        toast.error("Failed to process with AI", {
          description: "There was a problem analyzing your entry. Please try again.",
        })
      }
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete journal entry</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this journal entry from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 my-2 border rounded-md bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Entry from {exactDate}</p>
            <p className="mt-1 text-sm line-clamp-2">{entry.content.split("\n")[0]}</p>
          </div>
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn("transition-all", isDeleting && "bg-destructive/80")}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Entry
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <CardHeader className="pb-0 p-4 px-5 flex flex-row items-center justify-between bg-muted/60">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-normal bg-background">
                  {templateInfo.name}
                </Badge>
                {entry.ai_mood && (
                  <Badge variant="secondary" className="font-normal">
                    {entry.ai_mood}
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Calendar className="h-3 w-3" />
                <span title={exactDate}>{formattedDate}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/journal/${entry.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="px-5 pb-3">
          <div className="prose dark:prose-invert prose-sm max-w-none">
            {entry.content.split("\n").map((paragraph, i) => (
              <p key={i} className={paragraph.trim() === "" ? "h-4" : "mb-3 text-base last:mb-0"}>
                {paragraph}
              </p>
            ))}
          </div>

          {entry.ai_mood_score !== undefined && (
            <div className="mt-5 pt-4 border-t border-border/40">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium">Mood</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{getMoodEmoji(entry.ai_mood_score)}</span>
                  <span>{entry.ai_mood_score}/10</span>
                </div>
              </div>
              <Progress value={entry.ai_mood_score * 10} className={`h-1.5 ${getMoodColor(entry.ai_mood_score)}`} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start pt-0 px-5 pb-4">
          {!entry.aiProcessed ? (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={handleProcessWithAI}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Analyze with AI (1 credit)
                </>
              )}
            </Button>
          ) : (
            (entry.ai_summary || entry.ai_suggestion) && (
              <Collapsible open={showInsights} onOpenChange={setShowInsights} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-xs p-0 h-auto text-primary hover:text-primary/80"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {showInsights ? "Hide AI insights" : "Show AI insights"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3 pt-3 border-t border-border/40">
                  {entry.ai_summary && (
                    <div className="flex gap-3 text-sm rounded-md">
                      <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-xs mb-1 text-muted-foreground">Summary</p>
                        <p className="text-sm">{entry.ai_summary}</p>
                      </div>
                    </div>
                  )}
                  {entry.ai_suggestion && (
                    <div className="flex gap-3 text-sm rounded-md">
                      <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-xs mb-1 text-muted-foreground">Suggestion</p>
                        <p className="text-sm">{entry.ai_suggestion}</p>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )
          )}
        </CardFooter>
      </Card>
    </>
  )
}
