"use client";

import { useState, useMemo, useEffect } from "react";
import { BookOpen, Search, X } from "lucide-react";
import Sidebar from "../components/Sidebar";

interface Item {
  id: string;
  title: string;
  url?: string;       // info page
  pdf?: string;       // direct PDF link
  googleBookId?: string; // Google Books ID
  topic?: string;
  category?: string;
  type: "leisure" | "research";
  cover?: string;
}

// Example static leisure books
const leisureBooks: Item[] = [
  {
    id: "l1",
    title: "Pride and Prejudice",
    type: "leisure",
    category: "Romance",
    pdf: "https://www.gutenberg.org/ebooks/1342.pdf",
    cover: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
  },
  {
    id: "l2",
    title: "The Hobbit",
    type: "leisure",
    category: "Fantasy",
    pdf: "https://www.planetebook.com/free-ebooks/the-hobbit.pdf",
    cover: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
  },
  {
    id: "l3",
    title: "Great Expectations",
    type: "leisure",
    category: "Classics",
    pdf: "https://www.gutenberg.org/ebooks/1400.pdf",
    cover: "https://covers.openlibrary.org/b/id/8231855-L.jpg",
  },
];

export default function DiscoverPage() {
  const dummyUser = { id: "0001", email: "test@example.com", username: "TestUser" };
  const [user] = useState(dummyUser);

  const [activeTab, setActiveTab] = useState<"dashboard" | "discover" | "chat">("discover");
  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("leisure");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeisureCategory, setSelectedLeisureCategory] = useState<"All" | string>("All");

  const [studyBooks, setStudyBooks] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state for embedded viewer
  const [viewerBookId, setViewerBookId] = useState<string | null>(null);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch study books from Google Books API
  useEffect(() => {
    if (libraryTab === "research") {
      setLoading(true);
      fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:Computer+Science&maxResults=20`)
        .then((res) => res.json())
        .then((data) => {
          const books: Item[] = (data.items || []).map((b: any) => ({
            id: b.id,
            title: b.volumeInfo.title,
            cover: b.volumeInfo.imageLinks?.thumbnail,
            url: b.volumeInfo.infoLink,
            googleBookId: b.id,
            pdf: b.accessInfo?.pdf?.isAvailable ? b.accessInfo.pdf.downloadLink : undefined,
            type: "research",
            topic: b.volumeInfo.categories?.[0],
          }));
          setStudyBooks(books);
        })
        .finally(() => setLoading(false));
    }
  }, [libraryTab]);

  const allItems = useMemo(() => (libraryTab === "research" ? studyBooks : leisureBooks), [libraryTab, studyBooks]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        libraryTab === "leisure"
          ? selectedLeisureCategory === "All" || item.category === selectedLeisureCategory
          : true;
      return matchesSearch && matchesCategory;
    });
  }, [allItems, searchQuery, selectedLeisureCategory, libraryTab]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="min-h-screen flex bg-indigo-50">
      <Sidebar activeTab={activeTab} user={user} />

      <main className="flex-1 p-6">
        {/* Header */}
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

        {/* Filters */}
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

          {libraryTab === "leisure" && (
            <select
              value={selectedLeisureCategory}
              onChange={(e) => setSelectedLeisureCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-white shadow"
            >
              <option>All</option>
              <option>Fantasy</option>
              <option>Romance</option>
              <option>Classics</option>
            </select>
          )}
        </div>

        {/* Items grid */}
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={item.cover || "/placeholder.png"}
                  alt={item.title}
                  className="w-24 h-32 object-cover mb-2"
                />
                <p className="font-medium text-center">{item.title}</p>
                {item.topic && <p className="text-xs text-gray-500">{item.topic}</p>}

                {item.pdf ? (
                  // Leisure PDFs open in new tab
                  libraryTab === "leisure" ? (
                    <a
                      href={item.pdf}
                      target="_blank"
                      className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                    >
                      Read / Download PDF
                    </a>
                  ) : (
                    // Study PDFs open in embedded viewer modal
                    <button
                      onClick={() => setViewerBookId(item.googleBookId || null)}
                      className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                    >
                      Preview
                    </button>
                  )
                ) : item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    className="mt-2 px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400"
                  >
                    View Details
                  </a>
                ) : null}
              </div>
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

        {/* Embedded Viewer Modal */}
        {viewerBookId && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-[80%] h-[80%] rounded-xl relative">
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-black"
                onClick={() => setViewerBookId(null)}
              >
                <X size={24} />
              </button>
              <iframe
                src={`https://books.google.com/books?id=${viewerBookId}&printsec=frontcover&output=embed`}
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
