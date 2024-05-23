'use client';

import { Message, useAssistant as useAssistant } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { Send, XCircle } from 'lucide-react';

const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'black',
  function: 'blue',
  tool: 'purple',
  assistant: 'green',
  data: 'orange',
};

export default function Chat() {
  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    stop,
  } = useAssistant({ api: '/api/assistant' });

  const inputRef = useRef<HTMLInputElement>(null);
  const [isMessageSent, setIsMessageSent] = useState(false);

  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
      setIsMessageSent(false);
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleSubmitButton = () => {
    setIsMessageSent(true);
  }

  const handleStop = () => {
    setIsMessageSent(false);
    stop();
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-3xl p-6 mx-auto mt-10">
      {error != null && (
        <div className="relative px-6 py-4 text-white bg-red-500 rounded-lg">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      <div className="flex-grow overflow-auto space-y-4">
        {messages.map((m: Message) => (
          <div
            key={m.id}
            className="whitespace-pre-wrap"
            style={{ color: roleToColorMap[m.role] }}
          >
            <strong>{`${m.role}: `}</strong>
            {m.role !== 'data' && m.content}
            {m.role === 'data' && (
              <>
                {(m.data as any).description}
                <br />
                <pre className="bg-gray-200 p-2 rounded-lg">
                  {JSON.stringify(m.data, null, 2)}
                </pre>
              </>
            )}
            <br />
            <br />
          </div>
        ))}

        {status === 'in_progress' && (
          <div className="w-full h-8 max-w-md p-2 mb-8 bg-gray-300 rounded-lg dark:bg-gray-600 animate-pulse" />
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col items-center p-4 bg-white mt-4 fixed bottom-0 pb-10">
        <div className="w-full flex px-4 items-center">
          <input
            ref={inputRef}
            disabled={status !== 'awaiting_message'}
            className="flex-grow px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full text-black"
            value={input}
            placeholder="What is the temperature in the living room?"
            onChange={handleInputChange}
          />
          {isMessageSent ? (
            <button
              className="p-2 ml-2 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-full flex content-center justify-center items-center"
              onClick={handleStop}
            >
              <XCircle className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              onClick={handleSubmitButton}
              type="submit"
              className="p-2 ml-2 bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full flex content-center justify-center items-center"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          )}

        </div>
        <p className="text-xs mt-2 text-slate-400 hover:text-slate-700">
          <sup>*</sup>Please do not share any private information with the chatbot.
        </p>
      </form>


    </div>
  );
}
