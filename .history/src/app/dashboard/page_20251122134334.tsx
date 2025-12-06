"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Eye, EyeOff } from "lucide-react";
import AvatarPlaceholder from "./AvatarScreen";

// Hardcoded dummy user
const dummyUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
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

  const [activeTab, setActiveTab] = useState<"dashboard" | "discover" | "chat">("dashboard");
  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("leisure");
  const [researchLibrary, setResearchLibrary] = useState(initialResearchLibrary);
  const [leisureLibrary, setLeisureLibrary] = useState(initialLeisureLibrary);
  const [formTitle, setFormTitle] = useState("");
  const [formAuthors, setFormAuthors] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const currentLibrary = libraryTab === "research" ? researchLibrary : leisureLibrary;
  const setCurrentLibrary = libraryTab === "research" ? setResearchLibrary : setLeisureLibrary;
  const [showAvatar, setShowAvatar] = useState(true);

  // Add or edit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const authorsArray = formAuthors.split(",").map((a) => a.trim());

    if (editingId) {
      setCurrentLibrary((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title: formTitle, authors: authorsArray, url: formUrl }
            : item
        )
      );
    } else {
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
    <div className="min-h-screen bg-indigo-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} user={user} />

      {/* Main content */}
      <main className="flex-1 p-6 relative">
       
  {/* Avatar Placeholder */}
{showAvatar && (
  <div className="w-full bg-white rounded-xl shadow flex items-center justify-center mb-6 h-48">
    <span className="text-gray-400">[User 2D Avatar Placeholder]</span>
  </div>
)}

       {/* Header with toggle */}
{/* Header with toggle and show/hide avatar */}
<div className="flex items-center justify-between mb-6">
  {/* Title */}
  <h1 className="text-3xl font-bold text-purple-700">Library</h1>

  {/* Controls: Show Avatar + Leisure/Study Toggle */}
  <div className="flex items-center gap-4">
    {/* Show/Hide Avatar Icon */}
    <button
      onClick={() => setShowAvatar(!showAvatar)}
      className="text-gray-700 hover:text-purple-600 transition"
      title={showAvatar ? "Hide Avatar" : "Show Avatar"}
    >
      {showAvatar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>

    {/* Leisure / Study Toggle */}
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


        {/* Grid view */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentLibrary.map((item) => (
            <div
              key={item.id}
              className="relative p-4 bg-white rounded-lg shadow flex flex-col items-center hover:shadow-md transition"
            >
              {/* Book settings */}
              <div className="absolute top-2 right-2">
                <div className="relative inline-block text-left">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setActiveDropdown(item.id)}
                  >
                    ⋮
                  </button>

                  {activeDropdown === item.id && (
                    <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleEdit(item);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDelete({ id: item.id, title: item.title });
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Book icon */}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-20 sm:w-20 sm:h-24 bg-purple-200 rounded-md mb-3 flex items-center justify-center text-3xl hover:bg-purple-300 transition"
                >
                  📚
                </a>
              ) : (
                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-purple-200 rounded-md mb-3 flex items-center justify-center text-3xl">
                  📚
                </div>
              )}

              <strong className="text-center text-sm sm:text-base">{item.title}</strong>
              <p className="text-xs sm:text-sm text-gray-600 text-center">{item.authors.join(", ")}</p>

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

        {/* Modal and Confirm Delete omitted for brevity */}
      </main>
    </div>
  );
}
