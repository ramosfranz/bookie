"use client";

import { useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "user" | "other";
  senderName?: string; // for group chats
  avatar?: string; // emoji or image URL
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
    <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow mb-4 flex flex-col">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex mb-3 items-end ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {/* Avatar for other users */}
          {msg.sender !== "user" && msg.avatar && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg mr-2 shrink-0">
              {msg.avatar}
            </div>
          )}

          {/* Message bubble */}
                    <div
            className={`p-3 rounded-lg max-w-xs break-words relative ${
              msg.sender === "user"
                ? "text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            style={msg.sender === "user" ? { backgroundColor: "#f67129" } : {}}
          >
            {/* Sender name for group chats */}
            {msg.senderName && msg.sender !== "user" && (
              <span className="font-semibold text-sm block mb-1">{msg.senderName}</span>
            )}

            <p>{msg.content}</p>

            <span className="text-xs text-gray-500 block text-right mt-1">
              {msg.timestamp}
            </span>
          </div>

          {/* Optional avatar on the right for user */}
          {msg.sender === "user" && msg.avatar && (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg ml-2 shrink-0">
              {msg.avatar}
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
}
