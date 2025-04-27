import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { journalTemplates } from "@/types/templates"
import Link from "next/link"
import { BookOpenText, Sparkles } from "lucide-react"

export default function TemplatesPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Journal Templates</h1>
        <p className="text-muted-foreground">Choose from different templates to guide your journaling practice</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(journalTemplates).map(([id, template]) => (
          <Card key={id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenText className="h-5 w-5 text-primary" />
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {template.prompts ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Prompts:</p>
                  <ul className="space-y-1 text-sm">
                    {template.prompts.map((prompt, index) => (
                      <li key={index} className="p-2 bg-muted/30 rounded-md">
                        {prompt}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm">{template.placeholder || "Start writing..."}</p>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/?template=${id}`} className="w-full">
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
