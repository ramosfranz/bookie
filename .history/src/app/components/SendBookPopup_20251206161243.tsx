"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Contact } from "../components/chat";
import { X, Search } from "lucide-react";

interface SendBookPopupProps {
  bookTitle: string;
  onClose: () => void;
  onSend: (contactId: string) => void;
}

export default function SendBookPopup({
  bookTitle,
  onClose,
  onSend,
}: SendBookPopupProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");

  // Fetch contacts from Supabase
  useEffect(() => {
    async function loadContacts() {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching contacts:", error);
        return;
      }

      // Map to match Contact interface if needed
      const mappedContacts: Contact[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        avatar: c.avatar || "👤",
        isGroup: c.isGroup || false,
        members: c.members || [],
        messages: [],
        sharedHistory: [],
      }));

      setContacts(mappedContacts);
    }

    loadContacts();
  }, []);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      {/* Popup Card */}
      <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Send “{bookTitle}”</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Contact List */}
        <div className="max-h-80 overflow-y-auto pr-1">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-100 rounded mb-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{contact.avatar}</span>
                <span>
                  {contact.name}
                  {contact.isGroup ? " (Group)" : ""}
                </span>
              </div>

              <button
                onClick={() => onSend(contact.id)}
                className="pixelButton px-3 py-1 text-sm"
              >
                Send
              </button>
            </div>
          ))}

          {filteredContacts.length === 0 && (
            <p className="text-center text-gray-500 py-4">No contacts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
