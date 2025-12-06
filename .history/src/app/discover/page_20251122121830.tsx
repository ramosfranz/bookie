"use client";

import { useState, useEffect, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";

interface Item {
  id: string;
  title: string;
  url: string;
  topic?: string;
  category?: string;
  tags?: string[];
  type: "leisure" | "research";
}

export default function DiscoverPage() {
  const dummyUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "test@example.com",
    username: "TestUser",
  };
  const user = dummyUser;

  const [activeTab, setActiveTab] = useState<"dashboard" | "discover" | "chat">(
    "discover"
  );

  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("research");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string | "All">("All");
  const [selectedTag, setSelectedTag] = useState<string | "All">("All");

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch books from Google Books API
  useEffect(() => {
    const controller = new AbortController();
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let query = searchQuery.trim() || "fiction"; // default for leisure
        if (libraryTab === "research" && searchQuery.trim() === "") query = "computer science";

        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
          )}&maxResults=40`,
          { signal: controller.signal }
        );

        const data = await res.json();

        const items: Item[] = (data.items || []).map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          url: item.volumeInfo.infoLink,
          topic: item.volumeInfo.categories?.[0] || "General",
          category: item.volumeInfo.printType || "Book",
          tags: item.volumeInfo.authors || [],
          type: libraryTab,
        }));

        setAllItems(items);
        setCurrentPage(1);
      } catch (error) {
        if ((error as any).name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchBooks, 500); // debounce search
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery, libraryTab]);

  // Filtering
  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => item.type === libraryTab)
      .filter((item) => {
        const matchesTopic = selectedTopic === "All" || item.topic === selectedTopic;
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;
        const matchesTag =
          selectedTag === "All" || (item.tags && item.tags.includes(selectedTag));
        return matchesTopic && matchesCategory && matchesTag;
      });
  }, [allItems, libraryTab, selectedTopic, selectedCategory, selectedTag]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="min-h-screen flex bg-indigo-50">
      <Sidebar activeTab={activeTab} user={user} />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Discover</h1>
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

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 flex-1">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={
                libraryTab === "research" ? "Search research books..." : "Search leisure books..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white shadow"
          >
            <option>All</option>
            {Array.from(new Set(allItems.map((i) => i.topic).filter(Boolean))).map(
              (t) => (
                <option key={t}>{t}</option>
              )
            )}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white shadow"
          >
            <option>All</option>
            {Array.from(
              new Set(allItems.map((i) => i.category).filter(Boolean))
            ).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white shadow"
          >
            <option>All</option>
            {Array.from(
              new Set(allItems.flatMap((i) => i.tags || []))
            ).map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Items grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading books...</p>
        ) : paginatedItems.length === 0 ? (
          <p className="text-center text-gray-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {paginatedItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <BookOpen className="w-12 h-12 text-purple-600 mb-3" />
                <p className="font-medium text-center">{item.title}</p>
                {item.topic && <p className="text-xs text-gray-500">{item.topic}</p>}
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-white shadow hover:bg-purple-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
