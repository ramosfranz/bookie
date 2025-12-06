"use client";

import { useState } from "react";

interface FriendInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  friend: {
    id: string;
    name: string;
    nickname: string;
    topBooks: string[];
    sharedHistory: { title: string; date: string }[];
  };
  onUpdateNickname: (newNick: string) => void;
  onUnfriend: () => void;
}

export default function FriendInfoPopup({
  isOpen,
  onClose,
  friend,
  onUpdateNickname,
  onUnfriend,
}: FriendInfoPopupProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [nickname, setNickname] = useState(friend.nickname);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg w-[420px] p-6 shadow-xl relative">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ✖️
        </button>

        {/* Friend Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-2xl">
            👤
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

            {/* Nickname */}
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nickname
            </label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3"
              placeholder="Enter nickname"
            />

            <button
              onClick={() => onUpdateNickname(nickname)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 mb-6"
            >
              Save Nickname
            </button>

            {/* Top 3 books */}
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Top 3 Books
            </h3>

            <ul className="space-y-2">
              {friend.topBooks.length > 0 ? (
                friend.topBooks.map((book, i) => (
                  <li
                    key={i}
                    className="p-3 bg-gray-100 border rounded-lg text-gray-700"
                  >
                    📘 {book}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No books added.</p>
              )}
            </ul>

            {/* Unfriend */}
            <button
              onClick={onUnfriend}
              className="mt-6 w-full text-red-600 font-semibold py-2 border border-red-400 rounded-lg hover:bg-red-50"
            >
              Unfriend
            </button>
          </div>
        )}

        {activeTab === "history" && (
          <div className="max-h-80 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-3">Shared Books</h3>

            {friend.sharedHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No shared books yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {friend.sharedHistory.map((entry, idx) => (
                  <li
                    key={idx}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-medium">📘 {entry.title}</div>
                    <div className="text-xs text-gray-500">
                      Shared on {entry.date}
                    </div>
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
