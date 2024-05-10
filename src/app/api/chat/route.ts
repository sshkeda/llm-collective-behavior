import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

function getModel(model: string) {
  switch (model) {
    case "gpt-4-turbo":
      return openai(model);
    case "models/gemini-1.5-pro-latest":
      return google(model);
    case "claude-3-opus-20240229":
      return anthropic(model);
    default:
      throw new Error(`Model ${model} not found`);
  }
}

export async function POST(request: Request) {
  const json = await request.json();

  const model = getModel(json.model);
  console.log(json);
  const result = await streamText({
    model,
    temperature: 0,
    system: json.system,
    prompt: json.prompt,
  });

  return result.toAIStreamResponse();
}
