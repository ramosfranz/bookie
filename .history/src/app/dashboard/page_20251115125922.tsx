// src/app/dashboard/page.tsx
"use client";

import { useState } from "react";

// Hardcoded dummy user
const dummyUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
  avatar_url: "",
  preferences: {},
};

// Initial dummy libraries
const initialResearchLibrary = [
  { id: "1", title: "Deep Learning Paper", authors: ["Ian Goodfellow"] },
  { id: "2", title: "Phishing Detection Study", authors: ["Alice Smith"] },
];

const initialLeisureLibrary = [
  { id: "1", title: "Harry Potter", authors: ["J.K. Rowling"] },
  { id: "2", title: "The Hobbit", authors: ["J.R.R. Tolkien"] },
];

export default function Dashboard() {
  const user = dummyUser;
  const [activeTab, setActiveTab] = useState<"research" | "leisure">("research");
  const [researchLibrary, setResearchLibrary] = useState(initialResearchLibrary);
  const [leisureLibrary, setLeisureLibrary] = useState(initialLeisureLibrary);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formAuthors, setFormAuthors] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentLibrary = activeTab === "research" ? researchLibrary : leisureLibrary;
  const setCurrentLibrary =
    activeTab === "research" ? setResearchLibrary : setLeisureLibrary;

  // Handle Add / Edit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const authorsArray = formAuthors.split(",").map((a) => a.trim());

    if (editingId) {
      // Edit
      setCurrentLibrary((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, title: formTitle, authors: authorsArray } : item
        )
      );
    } else {
      // Add
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: formTitle,
        authors: authorsArray,
      };
      setCurrentLibrary((prev) => [...prev, newItem]);
    }

    // Reset form
    setFormTitle("");
    setFormAuthors("");
    setEditingId(null);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    setCurrentLibrary((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle Edit
  const handleEdit = (item: { id: string; title: string; authors: string[] }) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormAuthors(item.authors.join(", "));
  };

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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 bg-white rounded-lg shadow flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="text"
          placeholder="Authors (comma separated)"
          value={formAuthors}
          onChange={(e) => setFormAuthors(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {editingId ? "Update" : "Add"} {activeTab === "research" ? "Research" : "Book"}
        </button>
      </form>

      {/* Library List */}
      <ul className="space-y-2">
        {currentLibrary.map((item) => (
          <li
            key={item.id}
            className="p-3 bg-white rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <strong>{item.title}</strong> | {item.authors.join(", ")}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
