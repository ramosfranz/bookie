"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ContactSidebar from "./ContactSidebar";
import AddContactPopup from "./AddContact";
import FriendInfoPopup from "./FriendInfo";
import ChatLog from "./ChatLog";

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

  const [contacts, setContacts] = useState<Contact[]>([
    { id: "c1", name: "Alice", avatar: "👩", messages: [{ id: "1", sender: "other", content: "Hey! How’s your research going?", timestamp: "10:00 AM" }] },
    { id: "c2", name: "Bob", avatar: "👨", messages: [{ id: "2", sender: "other", content: "Did you see the latest AI paper?", timestamp: "10:05 AM" }] },
  ]);

  const [selectedContactId, setSelectedContactId] = useState("c1");
  const [newMessage, setNewMessage] = useState("");
  const [showAddContactPopup, setShowAddContactPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const selectedContact = contacts.find((c) => c.id === selectedContactId)!;

  const friendProfile = {
    id: selectedContact.id,
    name: selectedContact.name,
    nickname: selectedContact.name,
    topBooks: ["Atomic Habits", "The Alchemist", "Deep Work"],
    sharedHistory: [
      { title: "The Alchemist", date: "Jan 4, 2025" },
      { title: "Deep Work", date: "Dec 18, 2024" },
    ],
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact.messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const message: Message = { id: Math.random().toString(36).substr(2, 9), sender: "user", content: text, timestamp };
    setContacts((prev) => prev.map((c) => (c.id === selectedContactId ? { ...c, messages: [...c.messages, message] } : c)));

    setTimeout(() => {
      const aiMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "other",
        content: "🤖 AI Response: I see! That’s interesting.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setContacts((prev) => prev.map((c) => (c.id === selectedContactId ? { ...c, messages: [...c.messages, aiMessage] } : c)));
    }, 1000);
  };

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="min-h-screen flex bg-indigo-50 relative">
      <Sidebar activeTab={activeTab} user={user} />

      <main className="flex flex-1">
        {/* Contact Sidebar */}
        <ContactSidebar
          contacts={contacts}
          selectedContactId={selectedContactId}
          setSelectedContactId={(id) => { setSelectedContactId(id); setShowAvatar(false); }}
          showAddContactPopup={showAddContactPopup}
          setShowAddContactPopup={setShowAddContactPopup}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Chat Column */}
        <div className="flex-1 flex flex-col p-6 h-screen">
          {showAvatar && (
            <div className="w-full bg-white rounded-xl shadow flex items-center justify-center mb-4 h-48">
              <span className="text-gray-400">[User 2D Avatar Placeholder]</span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-purple-700">{selectedContact.name}</h1>
            <div className="flex items-center gap-4 text-2xl ml-auto">
              <button onClick={() => setShowAvatar((prev) => !prev)} title="Show Avatar" className="hover:text-purple-600 transition">
                📘
              </button>
              <button onClick={() => setShowInfoPopup(true)} title="Contact Info" className="hover:text-purple-600 transition">
                ℹ️
              </button>
            </div>
          </div>

          {/* Chat log (scrollable) */}
          <ChatLog messages={selectedContact.messages} />

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
            <button onClick={handleSend} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Send
            </button>
          </div>
        </div>
      </main>

      <AddContactPopup
        isOpen={showAddContactPopup}
        onClose={() => setShowAddContactPopup(false)}
        onAddFriend={(username) => {
          const newId = "c" + Math.random().toString(36).substr(2, 5);
          setContacts((prev) => [...prev, { id: newId, name: username, avatar: "👤", messages: [] }]);
          setShowAddContactPopup(false);
        }}
        onCreateGroup={(groupName) => {
          const newId = "g" + Math.random().toString(36).substr(2, 5);
          setContacts((prev) => [...prev, { id: newId, name: groupName + " (Group)", avatar: "👥", messages: [] }]);
          setShowAddContactPopup(false);
        }}
      />

      <FriendInfoPopup
        isOpen={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
        friend={friendProfile}
        onUpdateNickname={(newNick) => console.log("Nickname updated:", newNick)}
        onUnfriend={() => console.log("Unfriend clicked")}
      />
    </div>
  );
}
