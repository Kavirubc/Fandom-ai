"use client";

import { useState } from "react";
import { ClientMessage } from "./api/action";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { Send, User, Bot } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-6">
      <div className="w-full max-w-3xl  flex flex-col space-y-4 p-8 overflow-auto  min-h-screen pb-40">
        <div className="flex-grow overflow-auto space-y-4">
          {conversation.map((message: ClientMessage) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xl flex flex-col items-start py-2 px-4 rounded-xl text-lg leading-loose ${message.role === "user" ? "bg-violet-100 text-black" : "bg-gray-100 text-gray-800"
                  } shadow-md`}
              >
                <div className="flex items-center">
                  {message.role === "user" ? (
                    <User className="w-5 h-5 mr-2 text-green-700 flex-shrink-0" />
                  ) : (
                    <Bot className="w-5 h-5 mr-2 text-violet-800 flex-shrink-0" />
                  )}
                  <span className="flex-grow">{message.display}</span>
                </div>
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
        className="w-full max-w-3xl flex items-center p-4 rounded-lg bg-white  mt-4  fixed bottom-0 pb-10"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          className="flex-grow p-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full text-black"
        />
        <button
          type="submit"
          className="p-2 ml-2 bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full flex items-center"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>

    </div>
  );
}
