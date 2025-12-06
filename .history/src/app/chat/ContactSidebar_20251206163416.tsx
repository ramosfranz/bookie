"use client";

import { Dispatch, SetStateAction } from "react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
}

interface ContactSidebarProps {
  contacts: Contact[];
  selectedContactId: string | null;
  setSelectedContactId: Dispatch<SetStateAction<string | null>>;
  showAddContactPopup: boolean;
  setShowAddContactPopup: Dispatch<SetStateAction<boolean>>;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function ContactSidebar({
  contacts,
  selectedContactId,
  setSelectedContactId,
  showAddContactPopup,
  setShowAddContactPopup,
  isCollapsed,
  setIsCollapsed,
}: ContactSidebarProps) {
  return (
    <div
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={`bg-white shadow-lg rounded-l-lg flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex flex-col flex-1">
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-orange-700">Contacts</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddContactPopup(true);
              }}
              className="text-white bg-orange-600 hover:bg-orange-700 rounded-full w-6 h-6 flex items-center justify-center text-sm"
            >
              +
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedContactId(contact.id);
              }}
              className={`flex items-center gap-3 p-2 rounded-lg text-left hover:bg-orange-100 transition ${
                contact.id === selectedContactId ? "bg-orange-200" : ""
              }`}
            >
              <span className="text-2xl">{contact.avatar}</span>
              {!isCollapsed && <span className="font-medium">{contact.name}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
