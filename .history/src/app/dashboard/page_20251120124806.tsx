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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);
const [isCollapsed, setIsCollapsed] = useState(false);


  return (
  <div className="min-h-screen bg-indigo-50 flex">

    {/* LEFT SIDEBAR */}
    <aside
  className={`${
    isCollapsed ? "w-[70px]" : "w-[180px]"
  } bg-white shadow-lg p-4 flex flex-col items-center transition-all duration-300`}
>
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


      {/* Section Separator */}
      <div className="w-full border-t my-4"></div>

      {/* Library Icons */}
      <nav className="flex flex-col items-center gap-6 mt-4">

        {/* Leisure */}
       <button
  onClick={() => setActiveTab("leisure")}
  className={`flex flex-col items-center text-xl ${
    activeTab === "leisure" ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
  }`}
>
  📚
  {!isCollapsed && <span className="text-sm mt-1">Leisure</span>}
</button>


        {/* Research */}
     <button
  onClick={() => setActiveTab("research")}
  className={`flex flex-col items-center text-xl ${
    activeTab === "research" ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
  }`}
>
  📘
  {!isCollapsed && <span className="text-sm mt-1">Study</span>}
</button>
      </nav>

      {/* Bottom Separator */}
      <div className="w-full border-t my-4 mt-auto"></div>

      {/* Settings */}


<button className="text-gray-500 hover:text-gray-700 text-3xl mb-4">
  ⚙️
</button>

    </aside>

    {/* MAIN CONTENT */}
    <main className="flex-1 p-6 relative">

      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        {activeTab === "research" ? "Study Library" : "Leisure Library"}
      </h1>

      {/* Grid View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {currentLibrary.map((item) => (
          <div
            key={item.id}
            className="relative p-4 bg-white rounded-lg shadow flex flex-col items-center hover:shadow-md transition"
          >
            {/* Top-right 3-dot menu */}
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

            {/* Book Icon */}
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
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              {item.authors.join(", ")}
            </p>

            {/* Optional View link */}
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
              {editingId ? "Edit Entry" : "Add Entry"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Authors (comma separated)"
                value={formAuthors}
                onChange={(e) => setFormAuthors(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="url"
                placeholder="URL"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {editingId ? "Save" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  </div>
  );
}
