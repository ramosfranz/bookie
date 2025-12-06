"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AddContactPopup from "./AddContact";

interface Message {
  id: string;
  sender: "user" | "other";
  content: string;
  timestamp: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
}

export default function ChatPage() {
  const dummyUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "test@example.com",
    username: "TestUser",
  };

  const user = dummyUser;
  const [activeTab, setActiveTab] = useState<"research" | "leisure" | "discover" | "chat">("chat");

  // Dummy contacts
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "c1",
      name: "Alice",
      avatar: "👩",
      messages: [
        { id: "1", sender: "other", content: "Hey! How’s your research going?", timestamp: "10:00 AM" },
      ],
    },
    {
      id: "c2",
      name: "Bob",
      avatar: "👨",
      messages: [
        { id: "2", sender: "other", content: "Did you see the latest AI paper?", timestamp: "10:05 AM" },
      ],
    },
  ]);

  const [selectedContactId, setSelectedContactId] = useState("c1");
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [showAddContactPopup, setShowAddContactPopup] = useState(false);

  const selectedContact = contacts.find((c) => c.id === selectedContactId)!;

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedContact.messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const message: Message = { id: Math.random().toString(36).substr(2, 9), sender: "user", content: text, timestamp };

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContactId
          ? { ...c, messages: [...c.messages, message] }
          : c
      )
    );

    // Dummy AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "other",
        content: "🤖 AI Response: I see! That’s interesting.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContactId
            ? { ...c, messages: [...c.messages, aiMessage] }
            : c
        )
      );
    }, 1000);
  };

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // NEW: collapsible contacts sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Prevent clicks on buttons from toggling collapse
  const stopCollapse = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="min-h-screen flex bg-indigo-50">
      <Sidebar activeTab={activeTab} user={user} />

      <main className="flex-1 flex">
        {/* Contacts list */}
<div
  onClick={() => setIsCollapsed(!isCollapsed)}
  className={`bg-white shadow-lg rounded-l-lg flex flex-col transition-all duration-300 ${
    isCollapsed ? "w-16" : "w-64"
  }`}
>
  <div className="p-4 flex flex-col flex-1">
    {!isCollapsed && (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-700">Contacts</h2>
        <button
  onClick={(e) => {
    e.stopPropagation();
    setShowAddContactPopup(true);
  }}
  className="text-white bg-purple-600 hover:bg-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm"
>
  +
</button>

      </div>
    )}

    <div className={`flex flex-col gap-2 overflow-y-auto flex-1`}>
      {contacts.map((contact) => (
        <button
          key={contact.id}
          onClick={(e) => {
            e.stopPropagation(); // prevent collapse
            setSelectedContactId(contact.id);
          }}
          className={`flex items-center gap-3 p-2 rounded-lg text-left hover:bg-purple-100 transition ${
            contact.id === selectedContactId ? "bg-purple-200" : ""
          }`}
        >
          <span className="text-2xl">{contact.avatar}</span>
          {!isCollapsed && <span className="font-medium">{contact.name}</span>}
        </button>
      ))}
    </div>
  </div>
</div>


        {/* Chat area */}
        <div className="flex-1 flex flex-col p-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">{selectedContact.name}</h1>

          <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow mb-4">
            {selectedContact.messages.map((msg) => (
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

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 rounded-lg border outline-none"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    

    {showAddContactPopup && (
    <AddContactPopup onClose={() => setShowAddContactPopup(false)} />
    )}


    </div>
  );
}
