import type { Entry } from "@/types/entry"
import EntryItem from "./entry-item"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EntriesListProps {
  entries: Entry[]
}

export default function EntriesList({ entries }: EntriesListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No entries yet. Start journaling to see your entries here.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="max-h-[500px] pr-4">
      <div className="space-y-4">
        {entries.map((entry) => (
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </ScrollArea>
  )
}