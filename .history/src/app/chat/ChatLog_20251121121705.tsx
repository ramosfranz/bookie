"use client";

import { useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "user" | "other";
  content: string;
  timestamp: string;
}

interface ChatLogProps {
  messages: Message[];
}

export default function ChatLog({ messages }: ChatLogProps) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow mb-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-3 rounded-lg max-w-xs break-words ${
              msg.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            <p>{msg.content}</p>
            <span className="text-xs text-gray-500 block text-right mt-1">{msg.timestamp}</span>
          </div>
        </div>
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
}
