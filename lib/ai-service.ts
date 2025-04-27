import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"


export async function generateJournalSummary(journal: string) {
  const { text: summary } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Summarize the following journal entry in 2-3 concise sentences:\n\n${journal}`,
  });
  return summary;
}

export async function generateJournalMood(journal: string) {
  const { text: moodText } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Analyze the emotional tone of this journal entry and return in this exact format: "Mood: [single word or short phrase], Score: [number 1-10 where 10 is most positive]"\n\n ${journal}`,
  });
  const moodMatch = moodText.match(/Mood: (.*?), Score: (\d+)/)
  const mood = moodMatch ? moodMatch[1] : "Neutral"
  const moodScore = moodMatch ? parseInt(moodMatch[2]) : 5
  return { mood, moodScore };
}

export async function generateJournalSuggestion(journal: string) {
  const { text: suggestion } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Give a short, friendly tip or reflection based on this journal entry (max 2 sentences):\n\n${journal}`,
  });
  return suggestion;
}