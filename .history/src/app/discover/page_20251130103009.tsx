"use client";

import { useState, useMemo, useEffect } from "react";
import { BookOpen, Search, X, ExternalLink } from "lucide-react";
import Sidebar from "../components/Sidebar";

interface Book {
  id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  type: "leisure" | "research";
  category?: string;
  readUrl?: string;
  borrowUrl?: string;
  availability?: string;
}

export default function DiscoverPage() {
  const dummyUser = { id: "0001", email: "test@example.com", username: "TestUser" };
  const [user] = useState(dummyUser);

  const [activeTab, setActiveTab] = useState<"dashboard" | "discover" | "chat">("discover");
  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("leisure");

  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch books from Open Library API
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    
    let query = "";
    if (libraryTab === "leisure") {
      // Fetch popular fiction books
      query = "subject:fiction";
    } else {
      // Fetch academic/research books
      query = "subject:(computer science OR mathematics OR physics OR engineering)";
    }

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=50&has_fulltext=true`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedBooks: Book[] = (data.docs || []).map((doc: any) => {
          const coverId = doc.cover_i;
          const key = doc.key;
          
          return {
            id: doc.key,
            title: doc.title,
            author: doc.author_name?.[0],
            cover: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
            year: doc.first_publish_year,
            type: libraryTab,
            category: doc.subject?.[0],
            // Books with has_fulltext can be read on archive.org
            readUrl: doc.ia?.[0] ? `https://archive.org/details/${doc.ia[0]}` : undefined,
            borrowUrl: doc.lending_edition_s ? `https://openlibrary.org${doc.lending_edition_s}` : undefined,
            availability: doc.ia?.length > 0 ? "readable" : doc.lending_edition_s ? "borrowable" : "info",
          };
        }).filter((book: Book) => book.readUrl || book.borrowUrl); // Only show books that can be read/borrowed

        setBooks(fetchedBooks);
      })
      .catch((err) => console.error("Error fetching books:", err))
      .finally(() => setLoading(false));
  }, [libraryTab]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [books, searchQuery]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  return (
    <div className="min-h-screen flex bg-indigo-50">
      <Sidebar activeTab={activeTab} user={user} />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Discover Books</h1>
            <p className="text-sm text-gray-600 mt-1">Powered by Open Library & Internet Archive</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700">Fiction</span>
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
            <span className="text-gray-700">Academic</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 mb-6">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        {/* Books grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-purple-600 text-lg">Loading books...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {paginatedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={book.cover || "https://via.placeholder.com/150x200?text=No+Cover"}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <p className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</p>
                  {book.author && (
                    <p className="text-xs text-gray-600 mb-1">by {book.author}</p>
                  )}
                  {book.year && (
                    <p className="text-xs text-gray-500 mb-2">{book.year}</p>
                  )}

                  {book.readUrl && (
                    <a
                      href={book.readUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 text-center flex items-center justify-center gap-1"
                    >
                      <BookOpen size={14} />
                      Read Online
                    </a>
                  )}
                  {!book.readUrl && book.borrowUrl && (
                    <a
                      href={book.borrowUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 text-center flex items-center justify-center gap-1"
                    >
                      <ExternalLink size={14} />
                      Borrow
                    </a>
                  )}
                </div>
              ))}
            </div>

            {paginatedBooks.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                No books found. Try a different search term.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white shadow hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-purple-600 text-white"
                          : "bg-white shadow hover:bg-purple-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white shadow hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Info footer */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow text-sm text-gray-600">
          <p className="font-semibold mb-2">About this library:</p>
          <ul className="space-y-1 text-xs">
            <li>• <strong>Read Online:</strong> Books open directly in Internet Archive's BookReader (same tab)</li>
            <li>• <strong>Borrow:</strong> Some books require creating a free Internet Archive account to borrow</li>
            <li>• Books are sourced from Open Library, containing millions of titles</li>
            <li>• All books shown here have full-text access or borrowing options</li>
          </ul>
        </div>
      </main>

      {/* Embedded Viewer Modal (if needed) */}
      {viewerUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-black z-10 bg-white rounded-full p-2"
              onClick={() => setViewerUrl(null)}
            >
              <X size={24} />
            </button>
            <iframe
              src={viewerUrl}
              className="w-full h-full rounded-xl"
              title="Book Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
}