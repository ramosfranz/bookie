"use client";

import { useState, useMemo, useEffect } from "react";
import { BookOpen, Search, X, Filter } from "lucide-react";
import Sidebar from "../components/Sidebar";

interface Book {
  id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  type: "leisure" | "research";
  subjects?: string[];
  formats?: { [key: string]: string };
  source: "gutendex" | "openlibrary";
}

// Fiction genres for leisure reading
const FICTION_GENRES = [
  "All",
  "Adventure",
  "Romance",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Horror",
  "Historical Fiction",
  "Thriller",
  "Classic Literature"
];

// Academic subjects for research
const ACADEMIC_SUBJECTS = [
  "All",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Biology",
  "Chemistry",
  "Psychology",
  "Philosophy",
  "History"
];

export default function DiscoverPage() {
  const dummyUser = { id: "0001", email: "test@example.com", username: "TestUser" };
  const [user] = useState(dummyUser);

  const [activeTab, setActiveTab] = useState<"dashboard" | "discover" | "chat">("discover");
  const [libraryTab, setLibraryTab] = useState<"leisure" | "research">("leisure");

  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState<string>("");

  const itemsPerPage = 18;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch books from multiple sources
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    setBooks([]);

    const fetchPromises: Promise<Book[]>[] = [];

    if (libraryTab === "leisure") {
      // Fetch from Gutendex (Project Gutenberg) - Fiction
      fetchPromises.push(
        fetch(`https://gutendex.com/books?topic=fiction&languages=en`)
          .then((res) => res.json())
          .then((data) => {
            return (data.results || []).slice(0, 40).map((book: any) => ({
              id: `gutendex-${book.id}`,
              title: book.title,
              author: book.authors?.[0]?.name,
              cover: book.formats?.["image/jpeg"],
              year: book.authors?.[0]?.birth_year,
              type: "leisure" as const,
              subjects: book.subjects || [],
              formats: book.formats,
              source: "gutendex" as const,
            }));
          })
          .catch(() => [])
      );

      // Fetch from Open Library - Popular Fiction
      fetchPromises.push(
        fetch(`https://openlibrary.org/search.json?q=subject:fiction&has_fulltext=true&limit=40`)
          .then((res) => res.json())
          .then((data) => {
            return (data.docs || []).map((doc: any) => ({
              id: `openlibrary-${doc.key}`,
              title: doc.title,
              author: doc.author_name?.[0],
              cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
              year: doc.first_publish_year,
              type: "leisure" as const,
              subjects: doc.subject || [],
              formats: { ia: doc.ia?.[0] },
              source: "openlibrary" as const,
            })).filter((book: Book) => book.formats?.ia);
          })
          .catch(() => [])
      );
    } else {
      // Fetch from Gutendex - Academic subjects
      const topics = ["computer", "mathematics", "physics", "science"];
      topics.forEach(topic => {
        fetchPromises.push(
          fetch(`https://gutendex.com/books?topic=${topic}&languages=en`)
            .then((res) => res.json())
            .then((data) => {
              return (data.results || []).slice(0, 15).map((book: any) => ({
                id: `gutendex-${book.id}`,
                title: book.title,
                author: book.authors?.[0]?.name,
                cover: book.formats?.["image/jpeg"],
                year: book.authors?.[0]?.birth_year,
                type: "research" as const,
                subjects: book.subjects || [],
                formats: book.formats,
                source: "gutendex" as const,
              }));
            })
            .catch(() => [])
        );
      });

      // Fetch from Open Library - Academic
      fetchPromises.push(
        fetch(`https://openlibrary.org/search.json?q=subject:(computer+science+OR+mathematics+OR+physics+OR+engineering)&has_fulltext=true&limit=30`)
          .then((res) => res.json())
          .then((data) => {
            return (data.docs || []).map((doc: any) => ({
              id: `openlibrary-${doc.key}`,
              title: doc.title,
              author: doc.author_name?.[0],
              cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
              year: doc.first_publish_year,
              type: "research" as const,
              subjects: doc.subject || [],
              formats: { ia: doc.ia?.[0] },
              source: "openlibrary" as const,
            })).filter((book: Book) => book.formats?.ia);
          })
          .catch(() => [])
      );
    }

    Promise.all(fetchPromises)
      .then((results) => {
        const allBooks = results.flat();
        setBooks(allBooks);
      })
      .finally(() => setLoading(false));
  }, [libraryTab]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" ||
        book.subjects?.some((subject) =>
          subject.toLowerCase().includes(selectedGenre.toLowerCase())
        );

      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const openBookReader = (book: Book) => {
    setViewerTitle(book.title);

    if (book.source === "gutendex") {
      // For Gutendex books, use HTML reader or EPUB
      const htmlUrl = book.formats?.["text/html"];
      const epubUrl = book.formats?.["application/epub+zip"];
      
      if (htmlUrl) {
        // Open HTML version directly
        setViewerUrl(htmlUrl);
      } else if (epubUrl) {
        // Use epub.js reader for EPUB files
        setViewerUrl(`https://futurepress.github.io/epubjs-reader/?bookPath=${encodeURIComponent(epubUrl)}`);
      }
    } else if (book.source === "openlibrary") {
      // For Open Library books, use Internet Archive embed
      const iaId = book.formats?.ia;
      if (iaId) {
        setViewerUrl(`https://archive.org/embed/${iaId}`);
      }
    }
  };

  const currentFilters = libraryTab === "leisure" ? FICTION_GENRES : ACADEMIC_SUBJECTS;

  return (
    <div className="min-h-screen flex bg-indigo-50">
      <Sidebar activeTab={activeTab} user={user} />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Discover Books</h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredBooks.length} books from Project Gutenberg & Open Library
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700">Fiction</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={libraryTab === "research"}
                onChange={() => {
                  setLibraryTab(libraryTab === "research" ? "leisure" : "research");
                  setSelectedGenre("All");
                }}
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

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 flex-1">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-purple-50 transition"
          >
            <Filter size={18} />
            <span>Filters</span>
            {selectedGenre !== "All" && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">1</span>
            )}
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="font-semibold mb-3">
              {libraryTab === "leisure" ? "Fiction Genres" : "Academic Subjects"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {currentFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedGenre(filter)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    selectedGenre === filter
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Books grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-purple-600 text-lg">Loading books from multiple sources...</div>
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
                  {book.year && <p className="text-xs text-gray-500 mb-2">{book.year}</p>}

                  <button
                    onClick={() => openBookReader(book)}
                    className="mt-auto px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 flex items-center justify-center gap-1"
                  >
                    <BookOpen size={14} />
                    Read Now
                  </button>
                </div>
              ))}
            </div>

            {paginatedBooks.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-12">
                No books found. Try adjusting your filters or search term.
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
            <li>
              • <strong>70,000+ Books:</strong> Combined from Project Gutenberg (via Gutendex API)
              and Open Library/Internet Archive
            </li>
            <li>
              • <strong>No Login Required:</strong> All books are free and open directly in your
              built-in reader
            </li>
            <li>
              • <strong>Multiple Formats:</strong> HTML reader for Gutenberg books, Internet Archive
              BookReader for Open Library
            </li>
            <li>
              • <strong>Public Domain:</strong> All content is legally free and in the public domain
            </li>
          </ul>
        </div>
      </main>

      {/* Embedded BookReader Modal */}
      {viewerUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full h-full max-w-7xl max-h-[95vh] rounded-xl relative shadow-2xl flex flex-col">
            <div className="bg-purple-700 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
              <h3 className="font-semibold truncate">{viewerTitle}</h3>
              <button
                className="hover:bg-purple-600 rounded-full p-1 transition flex-shrink-0"
                onClick={() => {
                  setViewerUrl(null);
                  setViewerTitle("");
                }}
              >
                <X size={24} />
              </button>
            </div>
            <iframe
              src={viewerUrl}
              className="w-full flex-1 rounded-b-xl"
              title="Book Viewer"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}