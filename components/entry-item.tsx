import { formatDistanceToNow } from "date-fns"
import type { Entry } from "@/types/entry"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface EntryItemProps {
  entry: Entry
}

export default function EntryItem({ entry }: EntryItemProps) {
  const formattedDate = formatDistanceToNow(new Date(entry.date), {
    addSuffix: true,
  })

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
      <CardContent className="pt-6">
        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{entry.content}</p>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 py-3">
        {formattedDate}
      </CardFooter>
    </Card>
  )
}