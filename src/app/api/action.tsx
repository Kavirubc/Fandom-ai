"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { InfoComponent } from "../ai-component/info-component";
import { generateObject } from "ai";
import { infoSchema } from "../schema/info";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

// Define an explicit state variable to hold the conversation history
let conversationHistory: ServerMessage[] = [];

export async function continueConversation(input: string): Promise<ClientMessage> {
  "use server";

  // Append the new user input to the conversation history
  const newMessage: ServerMessage = { role: "user", content: input };
  conversationHistory.push(newMessage);
  // console.log("Updated conversation history after user input:", conversationHistory);

  // Call the OpenAI API to generate the assistant's response
  const result = await streamUI({
    model: openai("gpt-3.5-turbo-16k"),
    temperature: 0.2,
    topP: 1,
    messages: conversationHistory,
    text: ({ content, done }) => {
      if (done) {
        // Update the conversation history with the assistant's response
        const assistantMessage: ServerMessage = { role: "assistant", content };
        conversationHistory.push(assistantMessage);
        console.log("Updated conversation history after assistant response:", conversationHistory);
      }
      return <div>{content}</div>;
    },
    tools: {
      tellInfo: {
        description: "Tell me a fun fact",
        parameters: z.object({
          situation: z.string().describe("the person"),
        }),
        generate: async function* ({ situation }) {
          yield <div>Loading...</div>;
          const info = await generateObject({
            model: openai("gpt-3.5-turbo-16k"),
            schema: infoSchema,
            prompt: "Generate a fun fact of  max word count 10 that incorporates the following person:" + situation,
          });
          return <InfoComponent info={info.object} />;
        },
      },
    },
  });

  // Return the assistant's response to be displayed in the UI
  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
