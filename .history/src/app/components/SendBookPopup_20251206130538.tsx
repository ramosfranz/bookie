"use client";

import { Contact } from "../pages/ChatPage"; // reuse Contact interface
import { X } from "lucide-react";

interface SendBookPopupProps {
  bookTitle: string;
  contacts: Contact[];
  onClose: () => void;
  onSend: (contactId: string) => void;
}

export default function SendBookPopup({ bookTitle, contacts, onClose, onSend }: SendBookPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Send "{bookTitle}"</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {contacts.map(contact => (
            <button
              key={contact.id}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded mb-1 flex items-center gap-2"
              onClick={() => onSend(contact.id)}
            >
              <span className="text-xl">{contact.avatar}</span>
              <span>{contact.name}{contact.isGroup ? " (Group)" : ""}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
