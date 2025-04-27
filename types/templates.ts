export interface JournalTemplate {
  name: string
  description?: string
  placeholder?: string
  prompts?: string[]
}

export const journalTemplates: Record<string, JournalTemplate> = {
  "free-form": {
    name: "Free Form",
    description: "Write freely about anything on your mind.",
    placeholder: "What's on your mind today?",
  },
  gratitude: {
    name: "Gratitude",
    description: "Focus on what you're thankful for to boost positive emotions.",
    prompts: [
      "What are three things you're grateful for today?",
      "Who is someone that made a positive impact on your life recently?",
      "What's something small that brought you joy today?",
    ],
    placeholder: "I'm grateful for...",
  },
  reflection: {
    name: "Daily Reflection",
    description: "Reflect on your day, achievements, and areas for growth.",
    prompts: [
      "What went well today?",
      "What could have gone better?",
      "What did you learn today?",
      "What's one thing you want to focus on tomorrow?",
    ],
    placeholder: "Reflecting on my day...",
  },
  goals: {
    name: "Goals & Intentions",
    description: "Set clear intentions and track progress toward your goals.",
    prompts: [
      "What are your top 3 goals right now?",
      "What small step can you take today toward one of your goals?",
      "What obstacles might you face, and how will you overcome them?",
    ],
    placeholder: "My goals and intentions are...",
  },
  mood: {
    name: "Mood Journal",
    description: "Track your emotions and identify patterns in your mood.",
    prompts: [
      "How are you feeling right now? Why do you think you feel this way?",
      "What triggered any strong emotions today?",
      "What helped you feel better when you were down?",
    ],
    placeholder: "Today I'm feeling...",
  },
}
