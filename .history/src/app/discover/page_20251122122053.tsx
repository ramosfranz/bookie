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
  authors?: string[];
  cover?: string;
  type: "leisure" | "research";
}

const LEISURE_CATEGORIES = ["Fantasy", "Romance", "Classics"];

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

  // Fetch books
  useEffect(() => {
    const controller = new AbortController();
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let query = searchQuery.trim();
        if (!query) {
          query = libraryTab === "research" ? "computer science" : "fiction";
        }

        // For leisure, we can optionally fetch multiple categories
        let leisurePromises: Promise<any>[] = [];
        if (libraryTab === "leisure") {
          leisurePromises = LEISURE_CATEGORIES.map((cat) =>
            fetch(
              `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
                cat
              )}&maxResults=10`,
              { signal: controller.signal }
            ).then((res) => res.json())
          );
        }

        const researchPromise =
          libraryTab === "research"
            ? fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                  query
                )}&maxResults=40`,
                { signal: controller.signal }
              ).then((res) => res.json())
            : null;

        let items: Item[] = [];
        if (libraryTab === "leisure") {
          const results = await Promise.all(leisurePromises);
          results.forEach((data, index) => {
            const category = LEISURE_CATEGORIES[index];
            const catItems: Item[] = (data.items || []).map((item: any) => ({
              id: item.id,
              title: item.volumeInfo.title,
              url: item.volumeInfo.infoLink,
              topic: category,
              category: item.volumeInfo.printType || "Book",
              authors: item.volumeInfo.authors,
              cover: item.volumeInfo.imageLinks?.thumbnail,
              type: "leisure",
            }));
            items = [...items, ...catItems];
          });
        } else if (researchPromise) {
          const data = await researchPromise;
          items = (data.items || []).map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            url: item.volumeInfo.infoLink,
            topic: item.volumeInfo.categories?.[0] || "General",
            category: item.volumeInfo.printType || "Book",
            authors: item.volumeInfo.authors,
            cover: item.volumeInfo.imageLinks?.thumbnail,
            type: "research",
          }));
        }

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
          selectedTag === "All" || (item.authors && item.authors.includes(selectedTag));
        return matchesTopic && matchesCategory && matchesTag;
      });
  }, [allItems, libraryTab, selectedTopic, selectedCategory, selectedTag]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Group by topic (category) for Leisure
  const groupedItems = useMemo(() => {
    if (libraryTab !== "leisure") return { All: filteredItems };
    const groups: Record<string, Item[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.topic || "Other"]) groups[item.topic || "Other"] = [];
      groups[item.topic || "Other"].push(item);
    });
    return groups;
  }, [filteredItems, libraryTab]);

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
        </div>

        {/* Items Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading books...</p>
        ) : Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} className="mb-6">
            {libraryTab === "leisure" && <h2 className="text-xl font-semibold mb-2">{group}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-20 h-28 object-cover mb-3 rounded"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-purple-600 mb-3" />
                  )}
                  <p className="font-medium text-center">{item.title}</p>
                  {item.authors && (
                    <p className="text-xs text-gray-500 text-center">
                      {item.authors.join(", ")}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}

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
