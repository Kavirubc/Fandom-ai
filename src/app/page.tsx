"use client";

import { useState } from "react";
import { ClientMessage } from "./api/action";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { Send } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-6">
      <div className="w-full max-w-3xl  flex flex-col space-y-4 p-8 overflow-auto rounded-lg shadow-lg bg-gray-50 min-h-screen pb-40">
        <div className="flex-grow overflow-auto space-y-4">
          {conversation.map((message: ClientMessage) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xl p-4 rounded-lg text-lg leading-loose ${message.role === "user"
                  ? "bg-blue-100 text-black"
                  : "bg-gray-200 text-gray-800"
                  } shadow-md`}
              >
                <span className="font-medium">{message.role}</span>
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
        className="w-full max-w-2xl flex items-center p-4 rounded-lg shadow-md mt-4 bg-white fixed bottom-0 mb-10"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          className="flex-grow p-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg text-black"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-lg flex items-center m-2"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>
    </div>
  );
}
