"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar({ activeTab, user }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Prevent sidebar links from triggering collapse
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <aside
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={`${
        isCollapsed ? "w-[70px]" : "w-[180px]"
      } bg-white shadow-lg p-4 flex flex-col items-center transition-all duration-300 cursor-pointer`}
    >
      {/* Profile Section */}
      <Link href="/profile" onClick={handleLinkClick} className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-2xl">
          👤
        </div>
        {!isCollapsed && (
          <p className="mt-3 font-semibold text-purple-700">{user.username}</p>
        )}
      </Link>

      <div className="w-full border-t my-4"></div>

      {/* Tabs */}
      <nav className="flex flex-col items-center gap-6 mt-4">
        {/* Library */}
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className={`flex flex-col items-center text-xl ${
            activeTab === "dashboard"
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📚
          {!isCollapsed && <span className="text-sm mt-1">Library</span>}
        </Link>

        {/* Discover */}
        <Link
          href="/discover"
          onClick={handleLinkClick}
          className={`flex flex-col items-center text-xl ${
            activeTab === "discover"
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🔍
          {!isCollapsed && <span className="text-sm mt-1">Discover</span>}
        </Link>

        {/* Chat */}
        <Link
          href="/chat"
          onClick={handleLinkClick}
          className={`flex flex-col items-center text-xl ${
            activeTab === "chat"
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          💬
          {!isCollapsed && <span className="text-sm mt-1">Chat</span>}
        </Link>
      </nav>

      <div className="w-full border-t my-4 mt-auto"></div>

      <button
        onClick={(e) => e.stopPropagation()}
        className="text-gray-500 hover:text-gray-700 text-3xl mb-4"
      >
        ⚙️
      </button>
    </aside>
  );
}
