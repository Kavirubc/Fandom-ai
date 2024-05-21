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

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-3.5-turbo-16k"),
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      tellInfo: {
        description: "Tell me a one fun fact about this person. Keep the word count under 20.",
        parameters: z.object({
          situation: z.string().describe("the person"),
        }),
        generate: async function* ({ situation }) {
          yield <div>loading...</div>;
          const info = await generateObject({
            model: openai("gpt-3.5-turbo-16k"),
            schema: infoSchema,
            prompt:
              "Generate a info that incorporates the following person:" +
              situation,
          });
          return <InfoComponent info={info.object} />;
        },
      },
    },
  });

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
