"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Eye, EyeOff } from "lucide-react";
import LeisureLibrary from "../components/LeisureLibrary";
import ResearchLibrary from "../components/ResearchLibrary";
import '../styles/background.css';

export default function LibraryPage() {
  const [showAvatar, setShowAvatar] = useState(true);
  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("leisure");

  return (
    <div className="min-h-screen bookieBgVar1 flex">
      {/* Sidebar */}
      <Sidebar activeTab="library" />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        
        {/* Avatar Section */}
        {showAvatar && (
          <div className="w-full bg-white rounded-xl shadow flex items-center justify-center mb-6 h-48">
            <span className="text-gray-400">[User 2D Avatar Placeholder]</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Library</h1>

          <div className="flex items-center gap-4">

            {/* Avatar Toggle */}
            <button
              onClick={() => setShowAvatar(!showAvatar)}
              className="text-gray-700 hover:text-purple-600 transition"
            >
              {showAvatar ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>

            {/* Leisure / Study Switch */}
            <div className="flex items-center gap-2">

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={libraryTab === "research"}
                  onChange={() =>
                    setLibraryTab(prev =>
                      prev === "research" ? "leisure" : "research"
                    )
                  }
                />

                <div className="w-12 h-6 bg-gray-200 rounded-full peer-checked:bg-purple-600 transition-all"></div>

                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                    libraryTab === "research" ? "translate-x-6" : ""
                  }`}
                />
              </label>

              <span className="text-gray-700">Study</span>
            </div>
          </div>
        </div>

        {/* Render Libraries */}
        {libraryTab === "leisure" && <LeisureLibrary />}
        {libraryTab === "research" && <ResearchLibrary />}
      </main>
    </div>
  );
}
