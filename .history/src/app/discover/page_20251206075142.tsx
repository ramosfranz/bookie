"use client";

import { useState, useMemo, useEffect } from "react";
import { BookOpen, Search, X, Filter, FileText, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { addBookToLibrary, isBookInLibrary } from "@/lib/supabase/library";
import { supabase } from "@/lib/supabase/client";
import '../styles/background.css';

// --- TYPESCRIPT DECLARATIONS FOR GOOGLE BOOKS API ---
declare global {
  interface Window {
    google?: {
      books: {
        load: () => void;
        setOnLoadCallback: (callback: () => void) => void;
        DefaultViewer: new (element: HTMLElement) => {
          load: (identifier: string) => void;
        };
      };
    };
  }
}

interface Book {
  id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  type: "leisure" | "research";
  subjects?: string[];
  formats?: { [key: string]: string };
  source: "gutendex" | "openlibrary" | "googlebooks" | "arxiv";
  googleBooksId?: string;
  pdfUrl?: string;
  abstract?: string;
}

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
  const [viewerType, setViewerType] = useState<"iframe" | "google">("iframe");

  const itemsPerPage = 18;
  const [currentPage, setCurrentPage] = useState(1);

  // --- API FETCH LOGIC ---
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    setBooks([]);

    const fetchPromises: Promise<Book[]>[] = [];

    if (libraryTab === "leisure") {
      // Gutendex
      fetchPromises.push(
        fetch(`https://gutendex.com/books?topic=fiction&languages=en`)
          .then((res) => res.json())
          .then((data) => (data.results || []).slice(0, 100).map((book: any) => ({
            id: `gutendex-${book.id}`,
            title: book.title,
            author: book.authors?.[0]?.name,
            cover: book.formats?.["image/jpeg"]?.replace('http:', 'https:'),
            year: book.authors?.[0]?.birth_year,
            type: "leisure" as const,
            subjects: book.subjects || [],
            formats: book.formats,
            source: "gutendex" as const,
          })))
          .catch(() => [])
      );

      // Open Library
      fetchPromises.push(
        fetch(`https://openlibrary.org/search.json?q=subject:fiction&has_fulltext=true&limit=100`)
          .then((res) => res.json())
          .then((data) => (data.docs || []).map((doc: any) => ({
            id: `openlibrary-${doc.key}`,
            title: doc.title,
            author: doc.author_name?.[0],
            cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
            year: doc.first_publish_year,
            type: "leisure" as const,
            subjects: doc.subject || [],
            formats: { ia: doc.ia?.[0] },
            source: "openlibrary" as const,
          })).filter((book: Book) => book.formats?.ia))
          .catch(() => [])
      );

      // Google Books
      fetchPromises.push(
        fetch(`https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=40&langRestrict=en&printType=books&filter=partial`)
          .then((res) => res.json())
          .then((data) => (data.items || []).map((item: any) => ({
            id: `googlebooks-${item.id}`,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.[0],
            cover: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
            year: parseInt(item.volumeInfo.publishedDate?.split("-")[0]) || undefined,
            type: "leisure" as const,
            subjects: item.volumeInfo.categories || [],
            formats: {},
            source: "googlebooks" as const,
            googleBooksId: item.id,
          })).filter((book: Book) => book.googleBooksId))
          .catch((err) => { console.error("Google Books error:", err); return []; })
      );
    } else {
      // Research/Academic sources
      const topics = ["computer", "mathematics", "physics", "science"];
      topics.forEach(topic => {
        fetchPromises.push(
          fetch(`https://gutendex.com/books?topic=${topic}&languages=en`)
            .then((res) => res.json())
            .then((data) => (data.results || []).slice(0, 25).map((book: any) => ({
              id: `gutendex-${book.id}`,
              title: book.title,
              author: book.authors?.[0]?.name,
              cover: book.formats?.["image/jpeg"]?.replace('http:', 'https:'),
              year: book.authors?.[0]?.birth_year,
              type: "research" as const,
              subjects: book.subjects || [],
              formats: book.formats,
              source: "gutendex" as const,
            })))
            .catch(() => [])
        );
      });

      fetchPromises.push(
        fetch(`https://openlibrary.org/search.json?q=subject:(computer+science+OR+mathematics+OR+physics+OR+engineering)&has_fulltext=true&limit=50`)
          .then((res) => res.json())
          .then((data) => (data.docs || []).map((doc: any) => ({
            id: `openlibrary-${doc.key}`,
            title: doc.title,
            author: doc.author_name?.[0],
            cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
            year: doc.first_publish_year,
            type: "research" as const,
            subjects: doc.subject || [],
            formats: { ia: doc.ia?.[0] },
            source: "openlibrary" as const,
          })).filter((book: Book) => book.formats?.ia))
          .catch(() => [])
      );

      fetchPromises.push(
        fetch(`https://export.arxiv.org/api/query?search_query=cat:cs.*+OR+cat:math.*+OR+cat:astro-ph.*&start=0&max_results=100&sortBy=submittedDate&sortOrder=descending`)
          .then((res) => res.text())
          .then((xmlText) => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "text/xml");
            const entries = xml.querySelectorAll("entry");

            return Array.from(entries).map((entry) => {
              const id = entry.querySelector("id")?.textContent || "";
              const arxivId = id.split("arxiv.org/abs/")[1] || "";
              const title = entry.querySelector("title")?.textContent?.trim().replace(/\s+/g, ' ') || "";
              const authors = Array.from(entry.querySelectorAll("author name")).map((name) => name.textContent);
              const published = entry.querySelector("published")?.textContent || "";
              const year = new Date(published).getFullYear();
              const summary = entry.querySelector("summary")?.textContent?.trim().replace(/\s+/g, ' ') || "";
              const pdfLink = `https://arxiv.org/pdf/${arxivId}.pdf`;
              const categories = Array.from(entry.querySelectorAll("category")).map((cat) => cat.getAttribute("term") || "");

              return {
                id: `arxiv-${arxivId}`,
                title,
                author: authors[0] || "Unknown",
                cover: undefined,
                year,
                type: "research" as const,
                subjects: categories,
                formats: {},
                source: "arxiv" as const,
                pdfUrl: pdfLink,
                abstract: summary.substring(0, 200) + "...",
              };
            }).filter(paper => paper.title && paper.id);
          })
          .catch((err) => { console.error("arXiv error:", err); return []; })
      );
    }

    Promise.all(fetchPromises)
      .then((results) => {
        const allBooks = results.flat();
        const uniqueBooks = allBooks.filter((book, index, self) =>
          index === self.findIndex((b) => b.title.toLowerCase() === book.title.toLowerCase())
        );
        setBooks(uniqueBooks);
      })
      .finally(() => setLoading(false));
  }, [libraryTab]);

  // --- FILTERING AND PAGINATION ---
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === "All" ||
                           book.subjects?.some((subject) => subject.toLowerCase().includes(selectedGenre.toLowerCase()));
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // --- GOOGLE BOOKS VIEWER SCRIPT ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/books/jsapi.js';
    script.async = true;
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (viewerType === "google" && viewerUrl) {
      const initializeGoogleViewer = () => {
        if (window.google?.books) {
          window.google.books.load();
          const loadViewer = () => {
            const viewerDiv = document.getElementById('google-viewer-canvas');
            if (viewerDiv) {
              const viewer = new window.google.books.DefaultViewer(viewerDiv);
              viewer.load(viewerUrl);
            }
          };
          window.google.books.setOnLoadCallback(loadViewer);
        }
      };
      const timeoutId = setTimeout(initializeGoogleViewer, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [viewerType, viewerUrl]);

  // --- BOOK READER HANDLER ---
  const openBookReader = (book: Book) => {
    setViewerTitle(book.title);
    setViewerUrl(null);
    if (book.source === "gutendex") {
      const htmlUrl = book.formats?.["text/html"];
      const epubUrl = book.formats?.["application/epub+zip"];
      if (htmlUrl) { setViewerUrl(htmlUrl); setViewerType("iframe"); }
      else if (epubUrl) { setViewerUrl(`https://futurepress.github.io/epubjs-reader/?bookPath=${encodeURIComponent(epubUrl)}`); setViewerType("iframe"); }
    } else if (book.source === "openlibrary") {
      const iaId = book.formats?.ia;
      if (iaId) { setViewerUrl(`https://archive.org/embed/${iaId}`); setViewerType("iframe"); }
    } else if (book.source === "googlebooks") {
      if (book.googleBooksId) { setViewerUrl(book.googleBooksId); setViewerType("google"); }
    } else if (book.source === "arxiv") {
      if (book.pdfUrl) { setViewerUrl(book.pdfUrl); setViewerType("iframe"); }
    }
  };

const addToLibrary = async (book: Book) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please log in first.");
    return;
  }

  // Check if book already exists in library
  const already = await isBookInLibrary(user.id, book.id);
  if (already) {
    alert("This book is already in your library.");
    return;
  }

  // Add book to library
  const added = await addBookToLibrary(user.id, book);

  if (added) {
    alert("Book added to library!");
  }
};


  const getSourceBadge = (source: string) => {
    const badges = {
      gutendex: { label: "PG", color: "bg-green-500" },
      openlibrary: { label: "OL", color: "bg-blue-500" },
      googlebooks: { label: "GB", color: "bg-red-500" },
      arxiv: { label: "arXiv", color: "bg-orange-500" },
    };
    return badges[source as keyof typeof badges] || { label: "??", color: "bg-gray-500" };
  };

  const currentFilters = libraryTab === "leisure" ? FICTION_GENRES : ACADEMIC_SUBJECTS;

  return (
    <div className="min-h-screen flex bookieBgVar1">
      <Sidebar activeTab={activeTab}/>

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Discover</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Fiction</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={libraryTab === "research"} onChange={() => { setLibraryTab(libraryTab === "research" ? "leisure" : "research"); setSelectedGenre("All"); }} />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 transition-all"></div>
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${libraryTab === "research" ? "translate-x-6" : ""}`}></div>
            </label>
            <span className="text-gray-700">Academic</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 flex-1">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input type="text" placeholder="Search by title or author..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-purple-50 transition">
            <Filter size={18} /> <span>Filters</span>
            {selectedGenre !== "All" && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">1</span>}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="font-semibold mb-3">{libraryTab === "leisure" ? "Fiction Genres" : "Academic Subjects"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {currentFilters.map((filter) => (
                <button key={filter} onClick={() => setSelectedGenre(filter)} className={`px-3 py-2 rounded-lg text-sm transition ${selectedGenre === filter ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>{filter}</button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-purple-600 text-lg">Loading from multiple sources...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {paginatedBooks.map((book) => {
                const badge = getSourceBadge(book.source);
                const isResearchPaper = book.source === "arxiv";

                return (
                  <div key={book.id} className="flex flex-col bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <div className="relative">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-40 object-cover rounded mb-2" />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-indigo-100 rounded mb-2 flex items-center justify-center">
                          {isResearchPaper ? <FileText size={48} className="text-purple-400" /> : <BookOpen size={48} className="text-purple-400" />}
                        </div>
                      )}
                      <span className={`absolute top-1 right-1 text-xs px-2 py-0.5 rounded text-white ${badge.color}`}>{badge.label}</span>
                    </div>
                    <p className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</p>
                    {book.author && <p className="text-xs text-gray-600 mb-1">by {book.author}</p>}
                    {book.abstract && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{book.abstract}</p>}
                    {book.year && <p className="text-xs text-gray-500 mb-2">{book.year}</p>}

                    {/* Read Now / Read Paper */}
                    <button onClick={() => openBookReader(book)} className="mt-auto px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 flex items-center justify-center gap-1 mb-2">
                      {isResearchPaper ? <FileText size={14} /> : <BookOpen size={14} />}
                      {isResearchPaper ? "Read Paper" : "Read Now"}
                    </button>

                    {/* --- NEW: Add to Library --- */}
                    <button onClick={() => addToLibrary(book)} className="px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center justify-center gap-1">
                      <Plus size={14} /> Add to Library
                    </button>
                  </div>
                );
              })}
            </div>

            {paginatedBooks.length === 0 && !loading && <div className="text-center text-gray-500 py-12">No items found. Try adjusting your filters or search term.</div>}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-white shadow hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  if (pageNum < 1) return null;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`px-3 py-2 rounded-lg ${currentPage === pageNum ? "bg-purple-600 text-white" : "bg-white shadow hover:bg-purple-100"}`}>{pageNum}</button>
                  );
                })}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-white shadow hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
              </div>
            )}
          </>
        )}

      </main>

      {viewerUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full h-full max-w-7xl max-h-[95vh] rounded-xl relative shadow-2xl flex flex-col">
            <div className="bg-purple-700 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
              <h3 className="font-semibold truncate">{viewerTitle}</h3>
              <button className="hover:bg-purple-600 rounded-full p-1 transition flex-shrink-0" onClick={() => { setViewerUrl(null); setViewerTitle(""); setViewerType("iframe"); }}>
                <X size={24} />
              </button>
            </div>

            {viewerType === "iframe" ? (
              <iframe src={viewerUrl} className="w-full flex-1 rounded-b-xl" title="Document Viewer" allowFullScreen />
            ) : (
              <div id="google-viewer-canvas" className="w-full flex-1 rounded-b-xl overflow-hidden" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
