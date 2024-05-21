"use client";

import { useState } from "react";
import { ClientMessage } from "./action";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { Send } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-between p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4 overflow-auto flex-grow">
        <div className="flex-grow overflow-auto space-y-4">
          {conversation.map((message: ClientMessage) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${message.role === "user"
                  ? "bg-black text-white"
                  : "bg-gray-300 text-gray-900"
                  } hover:shadow-lg`}
              >
                <span className="block font-semibold">{message.role}</span>
                <span>{message.display}</span>
              </div>
            </div>
          ))}
        </div>
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
        className="w-full max-w-2xl flex items-center p-6 bg-white rounded-lg shadow-lg mt-4"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          className="flex-grow p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black rounded-l-none"
        />
        <button
          type="submit"
          className="p-2 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black rounded-r-none flex items-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
