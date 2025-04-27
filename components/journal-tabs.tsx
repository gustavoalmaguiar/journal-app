"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { journalTemplates } from "@/types/templates"
import JournalForm from "@/components/journal-form"

interface JournalTabsProps {
  activeTemplate: string
  setActiveTemplate: (template: string) => void
  addEntry: (content: string) => Promise<void>
}

export default function JournalTabs({ activeTemplate, setActiveTemplate, addEntry }: JournalTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Extract template from URL parameters
    const templateParam = searchParams.get("template")
    if (templateParam && journalTemplates[templateParam]) {
      setActiveTemplate(templateParam)
    }
  }, [searchParams, setActiveTemplate])

  const handleTemplateChange = (value: string) => {
    setActiveTemplate(value)

    // Update URL without full page reload
    const params = new URLSearchParams(searchParams.toString())
    params.set("template", value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs defaultValue="free-form" value={activeTemplate} onValueChange={handleTemplateChange} className="mb-8">
      <TabsList className="mb-4">
        {Object.entries(journalTemplates).map(([id, template]) => (
          <TabsTrigger key={id} value={id}>
            {template.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(journalTemplates).map(([id, template]) => (
        <TabsContent key={id} value={id}>
          <JournalForm onAddEntry={addEntry} template={template} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
