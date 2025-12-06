"use client";

import { useState, useMemo } from "react";
import { BookOpen, Star, TrendingUp, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";

interface Item {
  id: number;
  title: string;
  url: string;
  topic?: string;
  category?: string;
  tags?: string[];
}

export default function DiscoverPage() {
  const dummyUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "test@example.com",
    username: "TestUser",
  };

  const user = dummyUser;

  const [activeTab, setActiveTab] = useState<
    "research" | "leisure" | "discover" | "chat"
  >("discover");

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string | "All">("All");
  const [selectedTag, setSelectedTag] = useState<string | "All">("All");

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const [recommended] = useState<Item[]>([
    { id: 1, title: "Modern Web Security", url: "https://example.com/book1", topic: "Security", category: "Book", tags: ["AI", "Web"] },
    { id: 2, title: "AI & Society", url: "https://example.com/book2", topic: "AI", category: "Article", tags: ["Society"] },
    { id: 3, title: "Next.js Patterns", url: "https://example.com/book3", topic: "Web Dev", category: "Book", tags: ["Next.js"] },
  ]);

  const [trending] = useState<Item[]>([
    { id: 4, title: "Phishing Detection Trends 2024", url: "https://example.com/research1", topic: "Security", category: "Paper", tags: ["Phishing"] },
    { id: 5, title: "Hybrid Deep Learning Models", url: "https://example.com/research2", topic: "AI", category: "Paper", tags: ["Deep Learning"] },
  ]);

  const [recent] = useState<Item[]>([
    { id: 6, title: "Database Indexing Essentials", url: "https://example.com/book4", topic: "Database", category: "Book", tags: ["SQL"] },
  ]);

  // Filter & search logic
  const filteredItems = useMemo(() => {
    const allItems = [...recommended, ...trending, ...recent];
    return allItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = selectedTopic === "All" || item.topic === selectedTopic;
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesTag =
        selectedTag === "All" || (item.tags && item.tags.includes(selectedTag));
      return matchesSearch && matchesTopic && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedTopic, selectedCategory, selectedTag, recommended, trending, recent]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="min-h-screen flex bg-indigo-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Discover</h1>

        {/* Search & filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 flex-1">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
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
            <option>AI</option>
            <option>Security</option>
            <option>Web Dev</option>
            <option>Database</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white shadow"
          >
            <option>All</option>
            <option>Book</option>
            <option>Article</option>
            <option>Paper</option>
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white shadow"
          >
            <option>All</option>
            <option>AI</option>
            <option>Web</option>
            <option>Society</option>
            <option>Next.js</option>
            <option>Phishing</option>
            <option>Deep Learning</option>
            <option>SQL</option>
          </select>
        </div>

        {/* Items grid */}
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
              <p className="text-xs text-gray-500">{item.topic}</p>
            </a>
          ))}
        </div>

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
