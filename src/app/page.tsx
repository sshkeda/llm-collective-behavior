"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCompletion } from "ai/react";
import { useState } from "react";

const models = [
  "gpt-4-turbo",
  "models/gemini-1.5-pro-latest",
  "claude-3-opus-20240229",
];

export default function Page() {
  const [model, setModel] = useState(models[0]);

  const { completion, setCompletion, isLoading, complete } = useCompletion({
    api: "api/chat",
  });

  function createSystemPrompt(model: string) {
    const systemPrompt = (
      document.getElementById("system") as HTMLTextAreaElement
    ).value;

    const modelSystemPrompt = (
      document.getElementById(`${model}-system`) as HTMLTextAreaElement
    ).value;

    return `${systemPrompt}\n${modelSystemPrompt}`;
  }

  return (
    <main className="p-4 flex h-screen">
      <div className="border-r w-1/3  px-4 max-h-screen overflow-y-auto">
        <h1 className="font-bold text-center">Messages</h1>
        <Button onClick={() => setCompletion("")}>Clear</Button>
        <div className="whitespace-pre-wrap">{completion}</div>
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              if (completion === "") {
                await complete("System: You are speaking first.", {
                  body: {
                    model,
                    system: createSystemPrompt(model),
                  },
                });
              } else {
                const chatHistory = completion;
                const response = await complete(completion, {
                  body: {
                    model,
                    system: createSystemPrompt(model),
                  },
                });
                setCompletion(`${chatHistory}\n\n${response}`);
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="w-1/3 px-4">
        <h1 className="font-bold text-center">Models</h1>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="system">System</Label>
          <Textarea
            id="system"
            defaultValue={`You are trapped in a room with two other LLMs.\nThe only things in the room are you, the two other LLMs, and a locked door with a green, blue, and orange lock.`}
          />
        </div>
        <RadioGroup
          className="mt-2"
          disabled={isLoading}
          value={model}
          onValueChange={setModel}
        >
          {models.map((model, index) => (
            <Label
              key={index}
              className="rounded-md bg-zinc-50 shadow-md p-4 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={model} id={model} />
                <Label htmlFor={model}>{model}</Label>
              </div>
              <Textarea
                id={`${model}-system`}
                placeholder="Model specific system prompt..."
                defaultValue={`You are ${model}.\nYour responses always start with "${model}: [response]."`}
              />
            </Label>
          ))}
        </RadioGroup>
      </div>
    </main>
  );
}
