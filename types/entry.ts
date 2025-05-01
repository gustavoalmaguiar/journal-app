export interface Entry {
  id: string
  content: string
  date: Date
  template?: string
  ai_summary?: string
  ai_mood?: string
  ai_mood_score?: number
  ai_suggestion?: string
  aiProcessed?: boolean
}
