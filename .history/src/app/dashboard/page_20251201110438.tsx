"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Eye, EyeOff } from "lucide-react";
import LeisureLibrary from "../components/LeisureLibrary";
import ResearchLibrary from "../components/ResearchLibrary";

export default function LibraryPage() {
  const [showAvatar, setShowAvatar] = useState(true);
  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("leisure");

  return (
    <div className="min-h-screen bg-indigo-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab="library" />

      {/* Main content */}
      <main className="flex-1 p-6 relative">

        {/* Avatar */}
        {showAvatar && (
          <div className="w-full bg-white rounded-xl shadow flex items-center justify-center mb-6 h-48">
            <span className="text-gray-400">[User 2D Avatar Placeholder]</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Library</h1>

          <div className="flex items-center gap-4">

            {/* Avatar toggle */}
            <button
              onClick={() => setShowAvatar(!showAvatar)}
              className="text-gray-700 hover:text-purple-600 transition"
            >
              {showAvatar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {/* Leisure / Study Switch */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Leisure</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={libraryTab === "research"}
                  onChange={() =>
                    setLibraryTab(libraryTab === "research" ? "leisure" : "research")
                  }
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 transition-all"></div>
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                    libraryTab === "research" ? "translate-x-6" : ""
                  }`}
                ></div>
              </label>
              <span className="text-gray-700">Study</span>
            </div>
          </div>
        </div>

        {/* Actual Libraries */}
        {libraryTab === "leisure" && <LeisureLibrary />}
        {libraryTab === "research" && <ResearchLibrary />}
      </main>
    </div>
  );
}
