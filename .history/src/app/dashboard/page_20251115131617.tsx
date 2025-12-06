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

// Dummy libraries
const initialResearchLibrary = [
  { id: "1", title: "Deep Learning Paper", authors: ["Ian Goodfellow"], url: "https://example.com/dl-paper.pdf" },
  { id: "2", title: "Phishing Detection Study", authors: ["Alice Smith"], url: "https://example.com/phishing-study.pdf" },
];

const initialLeisureLibrary = [
  { id: "1", title: "Harry Potter", authors: ["J.K. Rowling"], url: "https://example.com/harry-potter" },
  { id: "2", title: "The Hobbit", authors: ["J.R.R. Tolkien"], url: "https://example.com/the-hobbit" },
];

export default function Dashboard() {
  const user = dummyUser;
  const [activeTab, setActiveTab] = useState<"research" | "leisure">("research");
  const [researchLibrary, setResearchLibrary] = useState(initialResearchLibrary);
  const [leisureLibrary, setLeisureLibrary] = useState(initialLeisureLibrary);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formAuthors, setFormAuthors] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentLibrary = activeTab === "research" ? researchLibrary : leisureLibrary;
  const setCurrentLibrary =
    activeTab === "research" ? setResearchLibrary : setLeisureLibrary;

  // Add/Edit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const authorsArray = formAuthors.split(",").map((a) => a.trim());

    if (editingId) {
      // Edit
      setCurrentLibrary((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title: formTitle, authors: authorsArray, url: formUrl }
            : item
        )
      );
    } else {
      // Add
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: formTitle,
        authors: authorsArray,
        url: formUrl,
      };
      setCurrentLibrary((prev) => [...prev, newItem]);
    }

    setFormTitle("");
    setFormAuthors("");
    setFormUrl("");
    setEditingId(null);
    setShowModal(false);
  };

  // Delete
  const handleDelete = (id: string) => {
    setCurrentLibrary((prev) => prev.filter((item) => item.id !== id));
  };

  // Edit
  const handleEdit = (item: { id: string; title: string; authors: string[]; url: string }) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormAuthors(item.authors.join(", "));
    setFormUrl(item.url);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen p-6 bg-indigo-50 relative">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        Welcome, {user.username}!
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
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

      {/* Grid View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {currentLibrary.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-lg shadow flex flex-col items-center justify-center hover:shadow-md transition"
          >
            <div className="w-12 h-16 bg-purple-200 rounded-md mb-2 flex items-center justify-center text-2xl">
              📚
            </div>
            <strong className="text-center">{item.title}</strong>
            <p className="text-sm text-gray-600 text-center">{item.authors.join(", ")}</p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs mt-1 hover:underline"
              >
                View
              </a>
            )}
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating + Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white text-3xl rounded-full shadow-lg hover:bg-purple-700 transition flex items-center justify-center"
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit" : "Add"} {activeTab === "research" ? "Research" : "Book"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
              <input
                type="url"
                placeholder="URL (PDF or reference link)"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
