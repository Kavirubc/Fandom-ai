"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { InfoComponent } from "../ai-component/info-component";
import { LinkComponent } from "../ai-component/link-component"; // Import the new component
import { generateObject } from "ai";
import { infoSchema } from "../schema/info";
import { linkSchema } from "../schema/link"; // Import the new schema

// Add Axios for making HTTP requests
import axios from 'axios';

export interface ServerMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const api = "https://api.example.com/rag";

export interface ClientMessage {
  id: string;
  role: "user" | "assistant" | "system";
  display: ReactNode;
}

// Define an explicit state variable to hold the conversation history
let conversationHistory: ServerMessage[] = [];

// Add a function to perform RAG retrieval
async function retrieveFromRAG(query: string): Promise<string> {
  try {
    const response = await axios.post(api, { query });
    return response.data.retrieved_text; // Adjust based on your API's response format
  } catch (error) {
    console.error("Error retrieving from RAG:", error);
    return "Failed to retrieve information.";
  }
}

export async function continueConversation(input: string): Promise<ClientMessage> {
  "use server";

  // Append the new user input to the conversation history
  const newMessage: ServerMessage = { role: "user", content: input };
  conversationHistory.push(newMessage);
  // console.log("Updated conversation history after user input:", conversationHistory);

  // Retrieve relevant information using RAG
  const retrievedInfo = await retrieveFromRAG(input);
  conversationHistory.push({ role: "system", content: retrievedInfo }); // Add retrieved info to conversation history

  // Call the OpenAI API to generate the assistant's response
  const result = await streamUI({
    model: openai("gpt-3.5-turbo-16k"),
    temperature: 0.5,
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
            temperature: 0.5,
            topP: 1,
            schema: infoSchema,
            prompt: "Generate a fun fact of max word count 10 that incorporates the following person: " + situation,
          });
          return <InfoComponent info={info.object} />;
        },
      },
      tellLink: { // New tool for generating linkComponent
        description: "Provide a related link",
        parameters: z.object({
          topic: z.string().describe("the topic"),
        }),
        generate: async function* ({ topic }) {
          yield <div>Loading...</div>;
          const link = await generateObject({
            model: openai("gpt-3.5-turbo-16k"),
            temperature: 0.5,
            topP: 1,
            schema: linkSchema,
            prompt: "Generate a link related to the following topic: " + topic,
          });
          return <LinkComponent link={link.object} />;
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
