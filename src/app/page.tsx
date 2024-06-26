"use client";

import { useState } from "react";
import { ClientMessage } from "./api/action";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { Send, User, Bot } from "lucide-react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Navbar } from "@/components/navbar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  const user = useUser();
  const firstName: string = user?.user?.firstName || "";

  const [showInfo, setShowInfo] = useState(true);

  function handleOnClick() {
    setShowInfo(false);
  }

  const prompts = [
    { text: "What's your favorite song you've written?" },
    { text: "Do you have any cat stories to share?" },
    { text: "Can you recommend a movie that you love?" },
    { text: "What's your favorite memory from a concert tour?" },
];


  function handleCard(text: string) {
    setInput(text);

  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black flex flex-col items-center p-6 mt-10">
        <div className="w-full max-w-3xl flex flex-col space-y-4 p-8 overflow-auto min-h-screen pb-40">
          {showInfo && (
            <>
              <div>
                {user.isSignedIn ? (
                  <div>
                    <h1 className="text-3xl font-bold">Welcome back {firstName}!</h1>
                    <p className="text-lg mt-4">Ask me anything about your favorite fandoms!</p>
                    <p className="flex flex-row text-base mt-4">Try our newest addition - <Link className="flex flex-row gap-x-1 underline" href="/taylor-swift"> Taylor Swift <IconArrowUpRight height={18} /></Link></p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold">Welcome to <span className="text-red-500">Fandom</span> <span className="text-violet-500">AI</span></h1>
                    <p className="text-lg mt-4">You are not logged in. Please log in for a personalized experience.</p>
                    <p className="text-lg mt-2">Ask me anything about your favorite fandoms!</p>
                  </div>
                )}
              </div>
              <div className="pt-48 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                {prompts.map((prompt, index) => (
                  <button
                    onClick={() => handleCard(prompt.text)}
                    key={index}
                    className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md border hover:border-violet-500 transition-colors duration-300"
                  >
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="flex-grow overflow-auto space-y-4">
            {conversation.map((message: ClientMessage) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xl flex flex-col items-start py-2 px-4 rounded-xl text-base leading-loose ${message.role === "user" ? "bg-gray-100 text-black" : "bg-violet-100 text-gray-800"
                    } shadow-md`}
                >
                  <div className="flex flex-row items-center">
                    {message.role !== "user" && <Bot className="w-8 h-8 mr-2 p-1 text-violet-800 flex-shrink-0 border items-center bg-white rounded-full" />}
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
          className="w-full max-w-3xl flex flex-col items-center p-4 rounded-lg bg-white mt-4 fixed bottom-0 pb-10"
        >
          <div className="w-full max-w-3xl flex px-4 items-center">
            <input
              type="text"
              placeholder="Send me a text message!"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              className="flex-grow px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full text-black"
            />
            <button
              type="submit"
              className="p-2 ml-2 bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full flex content-center justify-center items-center"
              onClick={handleOnClick}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-xs mt-2 text-slate-400 hover:text-slate-700">
            <sup>*</sup>Please do not share any private information with the chatbot.
          </p>
        </form>
      </div>
    </>
  );
}
