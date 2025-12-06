"use client";

import { useState } from "react";

// ✅ Hardcoded dummy user
const dummyUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
  avatar_url: "",
  preferences: {},
};

// Dummy libraries for development
const dummyResearchLibrary = [
  { id: "1", title: "Deep Learning Paper", authors: ["Ian Goodfellow"] },
  { id: "2", title: "Phishing Detection Study", authors: ["Alice Smith"] },
];

const dummyLeisureLibrary = [
  { id: "1", title: "Harry Potter", authors: ["J.K. Rowling"] },
  { id: "2", title: "The Hobbit", authors: ["J.R.R. Tolkien"] },
];

export default function Dashboard() {
  const user = dummyUser;
  const [activeTab, setActiveTab] = useState<"research" | "leisure">("research");

  return (
    <div className="min-h-screen p-6 bg-indigo-50">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        Welcome, {user.username}!
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "research" ? "bg-purple-600 text-white" : "bg-white"
          }`}
          onClick={() => setActiveTab("research")}
        >
          Research Library
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "leisure" ? "bg-purple-600 text-white" : "bg-white"
          }`}
          onClick={() => setActiveTab("leisure")}
        >
          Leisure Library
        </button>
      </div>

      {/* Content */}
      {activeTab === "research" ? (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Research Library</h2>
          <ul className="space-y-2">
            {dummyResearchLibrary.map((item) => (
              <li
                key={item.id}
                className="p-3 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <strong>{item.title}</strong> | Authors: {item.authors.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Leisure Library</h2>
          <ul className="space-y-2">
            {dummyLeisureLibrary.map((book) => (
              <li
                key={book.id}
                className="p-3 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <strong>{book.title}</strong> | Author: {book.authors.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
