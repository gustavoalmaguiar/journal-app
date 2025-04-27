import type { Entry } from "@/types/entry"
import EntryItem from "./entry-item"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EntriesListProps {
  entries: Entry[]
}

export default function EntriesList({ entries }: EntriesListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No entries yet. Start journaling to see your entries here.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="max-h-[800px] pr-2">
      <div className="space-y-6">
        {entries.map((entry) => (
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </ScrollArea>
  )
}
