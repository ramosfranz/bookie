"use client";

import { useState } from "react";
import Link from "next/link";


export default function Sidebar({ activeTab, setActiveTab, user }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? "w-[70px]" : "w-[180px]"
      } bg-white shadow-lg p-4 flex flex-col items-center transition-all duration-300`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="self-end text-gray-500 hover:text-gray-700 mb-4"
      >
        {isCollapsed ? "➡️" : "⬅️"}
      </button>

      {/* Profile Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-2xl">
          👤
        </div>
        {!isCollapsed && (
          <p className="mt-3 font-semibold text-purple-700">{user.username}</p>
        )}
      </div>

      {/* Separator */}
      <div className="w-full border-t my-4"></div>

      {/* Tabs */}
      <nav className="flex flex-col items-center gap-6 mt-4">

        {/* Leisure */}
        <button
          onClick={() => setActiveTab("leisure")}
          className={`flex flex-col items-center text-xl ${
            activeTab === "leisure"
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📚
          {!isCollapsed && <span className="text-sm mt-1">Leisure</span>}
        </button>

        {/* Study */}
        <button
          onClick={() => setActiveTab("research")}
          className={`flex flex-col items-center text-xl ${
            activeTab === "research"
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📘
          {!isCollapsed && <span className="text-sm mt-1">Study</span>}
        </button>

        {/* Discover */}
       <Link
  href="/discover"
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
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex flex-col items-center text-xl ${
            activeTab === "chat"
              ? "text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          💬
          {!isCollapsed && <span className="text-sm mt-1">Chat</span>}
        </button>
      </nav>

      {/* Bottom Separator */}
      <div className="w-full border-t my-4 mt-auto"></div>

      {/* Settings */}
      <button className="text-gray-500 hover:text-gray-700 text-3xl mb-4">
        ⚙️
      </button>
    </aside>
  );
}
