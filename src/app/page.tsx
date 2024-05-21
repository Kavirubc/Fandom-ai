"use client";

import { useState } from "react";
import { ClientMessage } from "./action";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
        <div className="flex-grow overflow-auto space-y-4">
          {conversation.map((message: ClientMessage) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                  }`}
              >
                <span className="block font-semibold">{message.role}</span>
                <span>{message.display}</span>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setInput("");
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: nanoid(), role: "user", display: input },
            ]);

            const message = await continueConversation(input);

            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              message,
            ]);
          }}
          className="flex"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
