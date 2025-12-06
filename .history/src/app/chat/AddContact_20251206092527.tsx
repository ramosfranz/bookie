"use client";

import { useState } from "react";
import '../styles/pixelButton.css';

interface AddContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (username: string) => void;
  onCreateGroup: (groupName: string) => void;
}

export default function AddContactPopup({ isOpen, onClose, onAddFriend, onCreateGroup }: AddContactPopupProps) {
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold text-orange-700 mb-4">Add Contact / Group</h2>

        {/* Add Friend */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Friend Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-3 py-2 border rounded-lg outline-none"
          />
          <button
            onClick={() => {
              if (username.trim()) {
                onAddFriend(username.trim());
                setUsername("");
                onClose();
              }
            }}
            className="pixelButton"
          >
            Add Friend
          </button>
        </div>

        {/* Create Group */}
        <div>
          <label className="block text-gray-700 mb-1">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full px-3 py-2 border rounded-lg outline-none"
          />
          <button
            onClick={() => {
              if (groupName.trim()) {
                onCreateGroup(groupName.trim());
                setGroupName("");
                onClose();
              }
            }}
            className="pixelButton"
          >
            Create Group
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✖️
        </button>
      </div>
    </div>
  );
}
