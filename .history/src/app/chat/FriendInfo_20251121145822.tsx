// FriendInfoPopup.tsx (updated)
"use client";

import { useState } from "react";
import FriendList from "./FriendList";

interface FriendInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  friend: {
    id: string;
    name: string;
    nickname?: string;
    topBooks?: string[];
    sharedHistory: { title: string; date: string }[];
    members?: { id: string; name: string; avatar: string }[];
    isGroup?: boolean;
  };
  allFriends: { id: string; name: string; avatar: string }[]; // friends list
  onUpdateNicknameOrGroupName: (newName: string) => void;
  onUnfriendOrLeaveGroup: () => void;
  onAddMember?: (friend: { id: string; name: string; avatar: string }) => void;
}

export default function FriendInfoPopup({
  isOpen,
  onClose,
  friend,
  allFriends,
  onUpdateNicknameOrGroupName,
  onUnfriendOrLeaveGroup,
  onAddMember,
}: FriendInfoPopupProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [name, setName] = useState(friend.name);
  const [showAddList, setShowAddList] = useState(false);

  if (!isOpen) return null;

  // filter friends that are not yet in the group
  const availableFriends =
    friend.isGroup && friend.members
      ? allFriends.filter((f) => !friend.members!.some((m) => m.id === f.id))
      : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg w-[420px] p-6 shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ✖️
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-2xl">
            {friend.isGroup ? "👥" : "👤"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-700">{friend.name}</h2>
            <p className="text-gray-500 text-sm">(@{friend.id})</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "profile"
                ? "border-b-2 border-purple-600 text-purple-700 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "history"
                ? "border-b-2 border-purple-600 text-purple-700 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Shared History
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "profile" && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {friend.isGroup ? "Group Name" : "Nickname"}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3"
              placeholder={friend.isGroup ? "Enter group name" : "Enter nickname"}
            />

            <button
              onClick={() => onUpdateNicknameOrGroupName(name)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 mb-6"
            >
              Save {friend.isGroup ? "Group Name" : "Nickname"}
            </button>

            {friend.isGroup && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Members</h3>
                  {availableFriends.length > 0 && (
                    <button
                      className="text-green-600 font-bold text-xl hover:text-green-800"
                      onClick={() => setShowAddList((prev) => !prev)}
                    >
                      +
                    </button>
                  )}
                </div>

                <ul className="space-y-2 mb-3">
                  {friend.members && friend.members.length > 0 ? (
                    friend.members.map((member) => (
                      <li
                        key={member.id}
                        className="p-3 bg-gray-100 border rounded-lg flex items-center gap-2"
                      >
                        <span className="text-2xl">{member.avatar}</span>
                        <span>{member.name}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No members added.</p>
                  )}
                </ul>

                {showAddList && (
  <FriendList
    friends={availableFriends}
    onAdd={(friend) => {
      onAddMember && onAddMember(friend);
      setShowAddList(false);
    }}
    onClose={() => setShowAddList(false)}
  />
)}

              </>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="max-h-80 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-3">
              {friend.isGroup ? "Shared Messages" : "Shared Books"}
            </h3>

            {friend.sharedHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">No shared items yet.</p>
            ) : (
              <ul className="space-y-3">
                {friend.sharedHistory.map((entry, idx) => (
                  <li
                    key={idx}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-medium">📘 {entry.title}</div>
                    <div className="text-xs text-gray-500">Shared on {entry.date}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
