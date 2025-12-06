"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Eye, EyeOff } from "lucide-react";
import LeisureLibrary from "../components/LeisureLibrary";
import ResearchLibrary from "../components/ResearchLibrary";
import "../styles/background.css";
import Image from "next/image";

export default function LibraryPage() {
  const [showAvatar, setShowAvatar] = useState(true);
  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("leisure");

  // ⭐ Add dummy contacts here for sending books
  const contacts = [
    { id: "c1", name: "Alice", avatar: "👩", messages: [] },
    { id: "c2", name: "Bob", avatar: "👨", messages: [] },
    { id: "c3", name: "Charlie", avatar: "🧑", messages: [] },
  ];

  return (
    <div className="min-h-screen bookieBgVar1 flex">
      <Sidebar activeTab="library" />

      <main className="flex-1 p-6 relative">
        {showAvatar && (
          <div className="w-full bg-white rounded-xl shadow flex items-center justify-center mb-6 h-48 relative overflow-hidden">
            <Image
              src="/image/avatarbg.gif"
              alt="User Avatar"
              fill
              className="object-cover pixelated"
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#f67129" }}>
            Library
          </h1>

          <div className="flex items-center gap-4">
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

            <div className="flex items-center gap-2">
              <span className="text-gray-700">Leisure</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={libraryTab === "research"}
                  onChange={() =>
                    setLibraryTab((prev) =>
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

        {/* ⭐ Pass contacts into LeisureLibrary */}
        {libraryTab === "leisure" && <LeisureLibrary contacts={contacts} />}

        {libraryTab === "research" && <ResearchLibrary />}
      </main>
    </div>
  );
}
