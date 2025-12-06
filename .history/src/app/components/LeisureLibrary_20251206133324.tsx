"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Heart, Trash2, X, BookOpen, Pin, Search, Grid, List, Plus, Edit, ArrowRight, Send } from "lucide-react";
import ManualImport from "./ManualImport";
import SendBookPopup from "../components/SendBookPopup";
import type { Contact } from "../components/chat";


interface LeisureItem {
  book_id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  progress?: number;
  status?: string;
  source?: "gutendex" | "openlibrary" | "googlebooks" | "arxiv" | "manual";
  formats?: { [key: string]: string };
  googleBooksId?: string;
  pdfUrl?: string;
  pinned?: boolean;
  user_library_id?: string;
}

interface BookEntry {
  id: string;
  pinned: boolean;
  books: {
    id: string;
    title: string;
    author?: string;
    cover?: string;
    year?: number;
    source?: "gutendex" | "openlibrary" | "googlebooks" | "arxiv" | "manual";
    formats?: { [key: string]: string };
    google_books_id?: string;
    pdf_url?: string;
  };
  library_type: string;
}

declare global {
  interface Window {
    google?: {
      books: {
        load: () => void;
        setOnLoadCallback: (callback: () => void) => void;
        DefaultViewer: new (element: HTMLElement) => { load: (id: string) => void };
      };
    };
  }
}

export default function LeisureLibrary() {
  const [items, setItems] = useState<LeisureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [favoriteBookIds, setFavoriteBookIds] = useState<string[]>([]);

  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState<string>("");
  const [viewerType, setViewerType] = useState<"iframe" | "google">("iframe");
  const [sendPopupOpen, setSendPopupOpen] = useState(false);
  const [selectedBookTitle, setSelectedBookTitle] = useState("");

  const handleOpenSendPopup = (title: string) => {
  setSelectedBookTitle(title);
  setSendPopupOpen(true);
};


  // Filter and view states
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showManualImport, setShowManualImport] = useState(false);
  const [editingBook, setEditingBook] = useState<LeisureItem | null>(null);

  // --- Load library items & favorites ---
  const loadItems = async () => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Auth error:", userError);
      setItems([]);
      setLoading(false);
      return;
    }
    const userId = userData.user.id;

    // Fetch library items
    const { data, error } = await supabase
      .from("user_library")
      .select(`
        id,
        pinned,
        library_type,
        books (
          id, title, author, cover, year, source, formats, google_books_id, pdf_url
        )
      `)
      .eq("user_id", userId)
      .eq("library_type", "leisure")
      .order("added_at", { ascending: false });

    if (error) console.error("Fetch error:", error);
    else if (data) {
      const typedData = data as unknown as BookEntry[];
      setItems(
        typedData.map((entry) => ({
          book_id: entry.books.id,
          title: entry.books.title,
          author: entry.books.author,
          cover: entry.books.cover,
          year: entry.books.year,
          source: entry.books.source,
          formats: entry.books.formats,
          googleBooksId: entry.books.google_books_id,
          pdfUrl: entry.books.pdf_url,
          pinned: entry.pinned,
          user_library_id: entry.id,
        }))
      );
    }

    // Fetch favorites
    const { data: favData, error: favError } = await supabase
      .from("user_favorites")
      .select("book_id")
      .eq("user_id", userId);

    if (favError) console.error("Failed to load favorites:", favError);
    else if (favData) setFavoriteBookIds(favData.map(fav => fav.book_id));

    setLoading(false);
  };

  // --- Toggle favorite ---
  const toggleFavorite = async (bookId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const userId = userData.user.id;

    const isFav = favoriteBookIds.includes(bookId);

    // Optimistic UI update
    setFavoriteBookIds(prev =>
      isFav ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );

    try {
      if (isFav) {
        await supabase.from("user_favorites").delete().eq("user_id", userId).eq("book_id", bookId);
      } else {
        await supabase.from("user_favorites").insert({ user_id: userId, book_id: bookId });
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
      // Rollback UI on error
      setFavoriteBookIds(prev =>
        isFav ? [...prev, bookId] : prev.filter(id => id !== bookId)
      );
    }
  };

  // --- Toggle pin ---
  const togglePin = async (item: LeisureItem) => {
    if (!item.user_library_id) return;

    const isPinned = item.pinned;

    if (!isPinned) {
      // Check if already at limit
      const pinnedCount = items.filter(i => i.pinned).length;
      if (pinnedCount >= 2) {
        alert("You can only pin up to 2 books. Unpin one first.");
        return;
      }
    }

    // Optimistic UI update
    setItems(prev =>
      prev.map(i =>
        i.user_library_id === item.user_library_id
          ? { ...i, pinned: !isPinned }
          : i
      )
    );

    try {
      const { error } = await supabase
        .from("user_library")
        .update({ pinned: !isPinned })
        .eq("id", item.user_library_id);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to toggle pin:", err);
      // Rollback UI on error
      setItems(prev =>
        prev.map(i =>
          i.user_library_id === item.user_library_id
            ? { ...i, pinned: isPinned }
            : i
        )
      );
    }
  };

  // --- Delete item ---
  const handleDelete = async (book_id: string) => {
    await supabase.from("user_library").delete().eq("book_id", book_id);
    loadItems();
  };

  // --- Move to Research Library ---
 const moveToResearch = async (item: LeisureItem) => {
  if (!item.user_library_id) return;

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const userId = userData.user.id;

    // Check if already in research library
    const { data: existing, error: existingError } = await supabase
      .from("user_library")
      .select("id")
      .eq("user_id", userId)
      .eq("book_id", item.book_id)
      .eq("library_type", "research")
      .maybeSingle();

    if (existingError) console.error("Check existing research library:", existingError);

    if (existing) {
      alert("This book is already in your Research library!");
      return;
    }

    // Update the library_type
    const { error } = await supabase
      .from("user_library")
      .update({ library_type: "research" })
      .eq("id", item.user_library_id);

    if (error) throw error;

    // Reload items
    loadItems();
    alert(`"${item.title}" moved to Research library!`);
  } catch (err) {
    console.error("Failed to move book:", err);
    alert("Failed to move book. Please try again.");
  }
};


  // --- Open book viewer ---
  const openBookReader = (book: LeisureItem) => {
    setViewerTitle(book.title);
    setViewerUrl(null);

    if (book.source === "gutendex") {
      const htmlUrl = book.formats?.["text/html"];
      const epubUrl = book.formats?.["application/epub+zip"];
      if (htmlUrl) setViewerUrl(htmlUrl);
      else if (epubUrl) setViewerUrl(`https://futurepress.github.io/epubjs-reader/?bookPath=${encodeURIComponent(epubUrl)}`);
      setViewerType("iframe");
    } else if (book.source === "openlibrary") {
      const iaId = book.formats?.ia;
      if (iaId) { setViewerUrl(`https://archive.org/embed/${iaId}`); setViewerType("iframe"); }
    } else if (book.source === "googlebooks") {
      if (book.googleBooksId) { setViewerUrl(book.googleBooksId); setViewerType("google"); }
    } else if (book.source === "arxiv") {
      if (book.pdfUrl) { setViewerUrl(book.pdfUrl); setViewerType("iframe"); }
    } else if (book.source === "manual") {
      // Handle manually imported books
      if (book.pdfUrl) {
        setViewerUrl(book.pdfUrl);
        setViewerType("iframe");
      } else if (book.formats) {
        // Check formats for PDF or EPUB
        const pdfUrl = book.formats["pdf"] || book.formats["url"];
        const epubUrl = book.formats["epub"];
        
        if (pdfUrl) {
          setViewerUrl(pdfUrl);
          setViewerType("iframe");
        } else if (epubUrl) {
          setViewerUrl(`https://futurepress.github.io/epubjs-reader/?bookPath=${encodeURIComponent(epubUrl)}`);
          setViewerType("iframe");
        }
      }
    }
  };

  // --- Filter and sort items ---
  const filteredItems = items
    .filter(item => {
      // Apply filter
      if (filter === "favorites" && !favoriteBookIds.includes(item.book_id)) {
        return false;
      }
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.author?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned items appear first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  // --- Load Google Books script ---
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/books/jsapi.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { 
      if (document.body.contains(script)) document.body.removeChild(script); 
    };
  }, []);

  // --- Google viewer initialization ---
  useEffect(() => {
    if (viewerType === "google" && viewerUrl) {
      const initGoogleViewer = () => {
        if (window.google?.books) {
          const viewerDiv = document.getElementById("google-viewer-canvas");
          if (viewerDiv) {
            const viewer = new window.google.books.DefaultViewer(viewerDiv);
            viewer.load(viewerUrl);
          }
        }
      };
      setTimeout(initGoogleViewer, 50);
    }
  }, [viewerType, viewerUrl]);

  // --- Load items on mount & subscribe ---
  useEffect(() => {
    loadItems();
    const channel = supabase
      .channel("user_library_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_library" }, () => loadItems())
      .on("postgres_changes", { event: "*", schema: "public", table: "user_favorites" }, () => loadItems())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filter and view mode */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("favorites")}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === "favorites"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Favorites
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition ${
                viewMode === "list"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-500">
          {searchQuery
            ? "No books found matching your search."
            : filter === "favorites"
            ? "You haven't favorited any books yet."
            : "Your leisure library is empty."}
        </p>
      ) : viewMode === "list" ? (
        // LIST VIEW
        <ul className="space-y-3">
          {filteredItems.map(item => (
            <li key={item.book_id} className="p-3 bg-white rounded shadow flex items-center gap-3 relative">
              {item.pinned && (
                <div className="absolute top-1 left-1 bg-orange-500 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                  <Pin size={10} /> Pinned
                </div>
              )}

              {item.cover ? (
                <img src={item.cover} alt={item.title} className="w-12 h-16 object-cover rounded" />
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <BookOpen size={24} className="text-orange-500" />
                </div>
              )}

              <div className="flex-1">
                <strong>{item.title}</strong>
                {item.author && <p className="text-sm text-gray-600">{item.author}</p>}
                <p className="text-sm text-gray-600">Progress: {item.progress ?? 0}% | Status: {item.status ?? "N/A"}</p>

                <div className="mt-1 flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center gap-1"
                    onClick={() => openBookReader(item)}
                  >
                    <BookOpen size={14} /> Read
                  </button>

                  <button onClick={() => toggleFavorite(item.book_id)}>
                    {favoriteBookIds.includes(item.book_id) ? (
                      <Heart size={16} className="text-red-500 fill-red-500" />
                    ) : (
                      <Heart size={16} className="text-gray-400" />
                    )}
                  </button>

                  <button onClick={() => togglePin(item)}>
                    {item.pinned ? (
                      <Pin size={16} className="text-orange-500 fill-orange-500" />
                    ) : (
                      <Pin size={16} className="text-gray-400" />
                    )}
                  </button>

                  <button
                  onClick={() => handleOpenSendPopup(item.title)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Send size={16} />
                </button>

                </div>
              </div>

              <div className="absolute top-2 right-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setActiveDropdown(activeDropdown === item.book_id ? null : item.book_id)}
                >
                  ⋮
                </button>
                {activeDropdown === item.book_id && (
                  <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {item.source === "manual" && (
                        <button
                          onClick={() => {
                            setEditingBook(item);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <Edit size={14} /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => {
                          moveToResearch(item);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-100 flex items-center gap-1"
                      >
                        <ArrowRight size={14} /> Move to Research
                      </button>
                      <button
                        onClick={() => handleDelete(item.book_id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // GRID VIEW
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <div key={item.book_id} className="bg-white rounded shadow overflow-hidden relative group">
              {item.pinned && (
                <div className="absolute top-1 left-1 bg-orange-500 text-white p-1 rounded z-10">
                  <Pin size={12} />
                </div>
              )}

              <div className="absolute top-1 right-1 z-10">
                <button
                  className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
                  onClick={() => setActiveDropdown(activeDropdown === item.book_id ? null : item.book_id)}
                >
                  ⋮
                </button>
                {activeDropdown === item.book_id && (
                  <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {item.source === "manual" && (
                        <button
                          onClick={() => {
                            setEditingBook(item);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <Edit size={14} /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => {
                          moveToResearch(item);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-100 flex items-center gap-1"
                      >
                        <ArrowRight size={14} /> Move to Research
                      </button>
                      <button
                        onClick={() => handleDelete(item.book_id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {item.cover ? (
                <img src={item.cover} alt={item.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <BookOpen size={48} className="text-orange-500" />
                </div>
              )}

              <div className="p-2">
                <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
                {item.author && <p className="text-xs text-gray-600 line-clamp-1">{item.author}</p>}

                <div className="mt-2 flex items-center justify-between">
                  <button
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    onClick={() => openBookReader(item)}
                  >
                    Read
                  </button>

                  <div className="flex gap-2">
                    <button onClick={() => toggleFavorite(item.book_id)}>
                      {favoriteBookIds.includes(item.book_id) ? (
                        <Heart size={14} className="text-red-500 fill-red-500" />
                      ) : (
                        <Heart size={14} className="text-gray-400" />
                      )}
                    </button>

                    <button onClick={() => togglePin(item)}>
                      {item.pinned ? (
                        <Pin size={14} className="text-orange-500 fill-orange-500" />
                      ) : (
                        <Pin size={14} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewerUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full h-full max-w-7xl max-h-[95vh] rounded-xl relative shadow-2xl flex flex-col">
            <div className="bg-orange-500 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
              <h3 className="font-semibold truncate">{viewerTitle}</h3>
              <button
                className="hover:bg-orange-600 rounded-full p-1 transition flex-shrink-0"
                onClick={() => { setViewerUrl(null); setViewerTitle(""); setViewerType("iframe"); }}
              >
                <X size={24} />
              </button>
            </div>

            {viewerType === "iframe" ? (
              <iframe src={viewerUrl!} className="w-full flex-1 rounded-b-xl" title="Document Viewer" allowFullScreen />
            ) : (
              <div id="google-viewer-canvas" className="w-full flex-1 rounded-b-xl overflow-hidden" />
            )}
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowManualImport(true)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40"
        title="Import book manually"
      >
        <Plus size={24} />
      </button>

      {/* Manual Import Modal */}
      {showManualImport && (
        <ManualImport
          onClose={() => setShowManualImport(false)}
          onSuccess={loadItems}
          libraryType="leisure"
        />
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <ManualImport
          onClose={() => setEditingBook(null)}
          onSuccess={loadItems}
          libraryType="leisure"
          editMode={editingBook}
        />
      )}

      {sendPopupOpen && (
  <SendBookPopup
    bookTitle={selectedBookTitle}
    contacts={contacts}                  // <-- your contact list
    onClose={() => setSendPopupOpen(false)}
    onSend={(contactId) => {
      console.log(`Sending "${selectedBookTitle}" to`, contactId);
      setSendPopupOpen(false);
    }}
  />
)}

    </div>
  );
}