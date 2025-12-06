"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { BookOpen, Heart, Trash2, X } from "lucide-react";

interface ResearchItem {
  book_id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  progress?: number;
  status?: string;
  source?: "gutendex" | "openlibrary" | "googlebooks" | "arxiv";
  formats?: { [key: string]: string };
  googleBooksId?: string;
  pdfUrl?: string;
  abstract?: string;
}

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

export default function ResearchLibrary() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Viewer states
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState<string>("");
  const [viewerType, setViewerType] = useState<"iframe" | "google">("iframe");

  // --- Fetch research library items ---
  async function loadItems() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const userId = userData.user.id;

    const { data, error } = await supabase
      .from("user_library")
      .select(`
        library_type,
        books (
          id,
          title,
          author,
          cover,
          year,
          source,
          formats,
          google_books_id,
          pdf_url,
          abstract
        )
      `)
      .eq("user_id", userId)
      .eq("library_type", "research")
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      setItems([]);
    } else {
      setItems(
        (data as any[]).map((entry) => ({
          book_id: entry.books.id,
          title: entry.books.title,
          author: entry.books.author,
          cover: entry.books.cover,
          year: entry.books.year,
          source: entry.books.source,
          formats: entry.books.formats,
          googleBooksId: entry.books.google_books_id,
          pdfUrl: entry.books.pdf_url,
          abstract: entry.books.abstract,
        }))
      );
    }
    setLoading(false);
  }

  // --- Delete an item ---
  async function handleDelete(book_id: string) {
    const { error } = await supabase
      .from("user_library")
      .delete()
      .eq("book_id", book_id);

    if (error) console.error("Delete error:", error);
    else loadItems();
  }

  // --- Open book/paper in viewer ---
  const openBookReader = (book: ResearchItem) => {
    setViewerTitle(book.title);
    setViewerUrl(null);

    if (book.source === "gutendex") {
      const htmlUrl = book.formats?.["text/html"];
      const epubUrl = book.formats?.["application/epub+zip"];
      if (htmlUrl) {
        setViewerUrl(htmlUrl);
        setViewerType("iframe");
      } else if (epubUrl) {
        setViewerUrl(
          `https://futurepress.github.io/epubjs-reader/?bookPath=${encodeURIComponent(epubUrl)}`
        );
        setViewerType("iframe");
      }
    } else if (book.source === "openlibrary") {
      const iaId = book.formats?.ia;
      if (iaId) {
        setViewerUrl(`https://archive.org/embed/${iaId}`);
        setViewerType("iframe");
      }
    } else if (book.source === "googlebooks") {
      if (book.googleBooksId) {
        setViewerUrl(book.googleBooksId);
        setViewerType("google");
      }
    } else if (book.source === "arxiv") {
      if (book.pdfUrl) {
        setViewerUrl(book.pdfUrl);
        setViewerType("iframe");
      }
    }
  };

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

  // --- Initialize Google Books viewer ---
  useEffect(() => {
    if (viewerType === "google" && viewerUrl) {
      const initGoogleViewer = () => {
        if (window.google?.books) {
          window.google.books.load();
          window.google.books.setOnLoadCallback(() => {
            const viewerDiv = document.getElementById("google-viewer-canvas");
            if (viewerDiv) {
              const viewer = new window.google.books.DefaultViewer(viewerDiv);
              viewer.load(viewerUrl);
            }
          });
        }
      };
      const timeoutId = setTimeout(initGoogleViewer, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [viewerType, viewerUrl]);

  // --- Subscribe to library changes ---
  useEffect(() => {
    loadItems();
    const channel = supabase
      .channel("user_library_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_library" },
        () => loadItems()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Research Library</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Your research library is empty.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.book_id}
              className="p-3 bg-white rounded shadow flex items-center gap-3 relative"
            >
              {item.cover ? (
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <BookOpen size={24} className="text-purple-500" />
                </div>
              )}

              <div className="flex-1">
                <strong>{item.title}</strong>
                {item.author && (
                  <p className="text-sm text-gray-600">by {item.author}</p>
                )}
                {item.year && (
                  <p className="text-xs text-gray-500">({item.year})</p>
                )}
                {item.abstract && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.abstract}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Progress: {item.progress ?? 0}% | Status: {item.status ?? "—"}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center gap-1"
                    onClick={() => openBookReader(item)}
                  >
                    <BookOpen size={14} />{" "}
                    {item.source === "arxiv" ? "Read Paper" : "Read"}
                  </button>

                  <button className="text-red-500 hover:text-red-600">
                    <Heart size={16} />
                  </button>
                  <button className="text-yellow-500 hover:text-yellow-600">
                    📌
                  </button>
                </div>
              </div>

              <div className="absolute top-2 right-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === item.book_id ? null : item.book_id
                    )
                  }
                >
                  ⋮
                </button>
                {activeDropdown === item.book_id && (
                  <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
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
          )}
      
      {/* --- Viewer Modal --- */}
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
                  setViewerType("iframe");
                }}
              >
                <X size={24} />
              </button>
            </div>

            {viewerType === "iframe" ? (
              <iframe
                src={viewerUrl}
                className="w-full flex-1 rounded-b-xl"
                title="Document Viewer"
                allowFullScreen
              />
            ) : (
              <div
                id="google-viewer-canvas"
                className="w-full flex-1 rounded-b-xl overflow-hidden"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
