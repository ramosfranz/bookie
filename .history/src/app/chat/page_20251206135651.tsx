"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ContactSidebar from "./ContactSidebar";
import AddContactPopup from "./AddContact";
import FriendInfoPopup from "./FriendInfo";
import ChatLog from "./ChatLog";
import { supabase } from "@/lib/supabase/client";
import '../styles/pixelButton.css';
import '../styles/background.css';
import Image from "next/image";

interface Message {
  id: string;
  contact_id: string;
  sender: "user" | "other";
  senderName?: string;
  avatar?: string;
  content: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  isGroup?: boolean;
  members?: { id: string; name: string; avatar: string }[];
  messages: Message[];
  sharedHistory?: { title: string; date: string }[];
}

export default function ChatPage() {
  const dummyUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "test@example.com",
    username: "TestUser",
    name: "TestUser",
    avatar: "🧑",
  };
  const user = dummyUser;

  const [activeTab, setActiveTab] = useState<"research" | "leisure" | "discover" | "chat">("chat");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showAddContactPopup, setShowAddContactPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch contacts & messages from Supabase
  useEffect(() => {
    async function loadContacts() {
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*");

      if (contactsError) {
        console.error("Error fetching contacts:", contactsError);
        return;
      }

      // Fetch messages for each contact
      const contactsWithMessages = await Promise.all(
        contactsData!.map(async (c: any) => {
          const { data: messagesData } = await supabase
            .from("messages")
            .select("*")
            .eq("contact_id", c.id)
            .order("timestamp", { ascending: true });
          return { ...c, messages: messagesData || [] };
        })
      );

      // Ensure AI Librarian exists
      const aiLibrarianExists = contactsWithMessages.some(c => c.name === "A.I. Librarian");
      if (!aiLibrarianExists) {
        const { data: newAI } = await supabase
          .from("contacts")
          .insert([{ id: crypto.randomUUID(), name: "A.I. Librarian", avatar: "📚", isGroup: false }])
          .select();
        contactsWithMessages.push({ ...newAI![0], messages: [] });
      }

      setContacts(contactsWithMessages);
      if (!selectedContactId && contactsWithMessages.length > 0) {
        setSelectedContactId(contactsWithMessages[0].id);
      }
    }

    loadContacts();
  }, []);

  const selectedContact = contacts.find(c => c.id === selectedContactId)!;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact?.messages]);

  // Send message
  const sendMessage = async (text: string) => {
    if (!text.trim() || !selectedContactId) return;

    const timestamp = new Date().toISOString();
    const message: Omit<Message, "id"> = {
      contact_id: selectedContactId,
      sender: "user",
      content: text,
      timestamp,
    };

    const { data: insertedMessage, error } = await supabase
      .from("messages")
      .insert([message])
      .select();

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    // Update local state
    setContacts(prev =>
      prev.map(c =>
        c.id === selectedContactId
          ? { ...c, messages: [...c.messages, insertedMessage![0]] }
          : c
      )
    );

    // Simulate AI Librarian response
    setTimeout(async () => {
      const aiMessage: Omit<Message, "id"> = {
        contact_id: selectedContactId,
        sender: "other",
        content: "🤖 Librarian: Got it!",
        timestamp: new Date().toISOString(),
      };

      const { data: insertedAI } = await supabase
        .from("messages")
        .insert([aiMessage])
        .select();

      setContacts(prev =>
        prev.map(c =>
          c.id === selectedContactId
            ? { ...c, messages: [...c.messages, insertedAI![0]] }
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

  return (
    <div className="min-h-screen flex bookieBgVar1 relative">
      <Sidebar activeTab={activeTab} />

      <main className="flex flex-1">
        <ContactSidebar
          contacts={contacts}
          selectedContactId={selectedContactId}
          setSelectedContactId={id => { setSelectedContactId(id); setShowAvatar(false); }}
          showAddContactPopup={showAddContactPopup}
          setShowAddContactPopup={setShowAddContactPopup}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div className="flex-1 flex flex-col p-6 h-screen">
          {showAvatar && (
            <div className="w-full bg-white rounded-xl shadow flex items-center justify-center mb-6 h-48 relative overflow-hidden">
              <Image
                src="/image/avatarbg.gif"
                alt="User Avatar"
                fill
                className="object-cover pixelated"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: "#fce8d9" }}
              >
                {selectedContact?.avatar}
              </div>
              <h1 className="text-3xl font-bold" style={{ color: "#f67129" }}>
                {selectedContact?.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-2xl ml-auto">
              <button
                onClick={() => setShowAvatar(prev => !prev)}
                title="Show Avatar"
                style={{ color: "#f67129" }}
                className="transition"
              >
                📘
              </button>

              <button
                onClick={() => setShowInfoPopup(true)}
                title="Contact Info"
                style={{ color: "#f67129" }}
                className="transition"
              >
                ℹ️
              </button>
            </div>
          </div>

          <ChatLog messages={selectedContact?.messages || []} />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 rounded-lg border outline-none"
            />
            <button
              onClick={handleSend}
              className="pixelButton"
            >
              Send
            </button>
          </div>
        </div>
      </main>

      <AddContactPopup
        isOpen={showAddContactPopup}
        onClose={() => setShowAddContactPopup(false)}
        onAddFriend={async (username) => {
          const id = crypto.randomUUID();
          const { data: newContact } = await supabase
            .from("contacts")
            .insert([{ id, name: username, avatar: "👤", isGroup: false }])
            .select();
          setContacts(prev => [...prev, { ...newContact![0], messages: [] }]);
          setShowAddContactPopup(false);
        }}
        onCreateGroup={async (groupName) => {
          const id = crypto.randomUUID();
          const { data: newGroup } = await supabase
            .from("contacts")
            .insert([{ id, name: groupName + " (Group)", avatar: "👥", isGroup: true }])
            .select();
          setContacts(prev => [...prev, { ...newGroup![0], messages: [] }]);
          setShowAddContactPopup(false);
        }}
      />

      <FriendInfoPopup
        isOpen={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
        friend={{
          id: selectedContact?.id!,
          name: selectedContact?.name!,
          nickname: selectedContact?.name!,
          isGroup: selectedContact?.isGroup || false,
          members: selectedContact?.members || [],
          sharedHistory: selectedContact?.sharedHistory || [],
        }}
        allFriends={[]} // pass your friends here
        onUpdateNicknameOrGroupName={async (newName) => {
          await supabase
            .from("contacts")
            .update({ name: newName })
            .eq("id", selectedContact?.id);
          setContacts(prev =>
            prev.map(c => c.id === selectedContact?.id ? { ...c, name: newName } : c)
          );
        }}
        onUnfriendOrLeaveGroup={() => {}}
        onAddMember={() => {}}
      />
    </div>
  );
}
