"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

interface BookItem {
  id: string;
  title: string;
  cover?: string;
  topic?: string;
  category?: string;
  pdfUrl?: string;
  type: "study" | "leisure";
}

// Set worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const dummyUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
};

export default function DiscoverPage() {
  const [user] = useState(dummyUser);
  const [activeTab] = useState<"dashboard" | "discover" | "chat">("discover");

  const [libraryTab, setLibraryTab] = useState<"study" | "leisure">("study");

  const [studyBooks, setStudyBooks] = useState<BookItem[]>([]);
  const [leisureBooks, setLeisureBooks] = useState<BookItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [leisureCategory, setLeisureCategory] = useState<"All" | "Fantasy" | "Romance" | "Classics">("All");

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  // --- Fetch Study books from Open Library ---
  useEffect(() => {
    const fetchStudyBooks = async () => {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=computer+science&limit=50`
        );
        const data = await res.json();

        const books: BookItem[] = data.docs.map((doc: any) => ({
          id: doc.key,
          title: doc.title,
          cover: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : undefined,
          topic: doc.subject ? doc.subject[0] : "Unknown",
          type: "study",
          pdfUrl: doc.ia ? `https://archive.org/download/${doc.ia}/${doc.ia}.pdf` : undefined,
        }));

        setStudyBooks(books);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudyBooks();
  }, []);

  // --- Fetch Leisure books from Gutenberg ---
  useEffect(() => {
    const fetchLeisureBooks = async () => {
      try {
        const res = await fetch(`https://gutendex.com/books/?languages=en&topic=fantasy&topic=romance`);
        const data = await res.json();

        const books: BookItem[] = data.results.map((book: any) => {
          // Find PDF format if available
          const pdfUrl = Object.entries(book.formats).find(
            ([format, url]) => format.includes("application/pdf")
          )?.[1] as string | undefined;

          // Assign categories: Fantasy, Romance, Classics based on Gutenberg subject
          const category =
            book.subjects?.includes("Fantasy") ? "Fantasy" :
            book.subjects?.includes("Romance") ? "Romance" :
            "Classics";

          return {
            id: String(book.id),
            title: book.title,
            cover: book.formats["image/jpeg"],
            category,
            type: "leisure",
            pdfUrl,
          };
        });

        setLeisureBooks(books);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeisureBooks();
  }, []);

  // --- Filtered items ---
  const allItems = useMemo(() => {
    let items = libraryTab === "study" ? studyBooks : leisureBooks;

    if (libraryTab === "leisure" && leisureCategory !== "All") {
      items = items.filter((b) => b.category === leisureCategory);
    }

    if (searchQuery) {
      items = items.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [libraryTab, leisureCategory, searchQuery, studyBooks, leisureBooks]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allItems.slice(startIndex, startIndex + itemsPerPage);
  }, [allItems, currentPage]);

  const totalPages = Math.ceil(allItems.length / itemsPerPage);

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
                checked={libraryTab === "study"}
                onChange={() =>
                  setLibraryTab(libraryTab === "study" ? "leisure" : "study")
                }
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 transition-all"></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                  libraryTab === "study" ? "translate-x-6" : ""
                }`}
              ></div>
            </label>
            <span className="text-gray-700">Study</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 flex-1">
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
              value={leisureCategory}
              onChange={(e) => setLeisureCategory(e.target.value as any)}
              className="px-3 py-2 rounded-lg border bg-white shadow"
            >
              <option>All</option>
              <option>Fantasy</option>
              <option>Romance</option>
              <option>Classics</option>
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {paginatedItems.map((book) => (
            <div key={book.id} className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              {book.cover && <img src={book.cover} className="w-24 h-32 object-cover mb-2 rounded" />}
              <p className="font-medium text-center">{book.title}</p>
              {book.category && <p className="text-xs text-gray-500">{book.category}</p>}
              {book.pdfUrl && (
                <button
                  onClick={() => {
                    setPdfUrl(book.pdfUrl!);
                    setPdfModalOpen(true);
                  }}
                  className="mt-2 px-2 py-1 bg-purple-600 text-white rounded text-sm"
                >
                  Read / Download PDF
                </button>
              )}
            </div>
          ))}
        </div>

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

        {/* PDF Modal */}
        {pdfModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto relative">
              <button
                className="absolute top-2 right-2 text-red-600 text-xl font-bold"
                onClick={() => setPdfModalOpen(false)}
              >
                ✕
              </button>
              <Document file={pdfUrl}>
                <Page pageNumber={1} width={600} />
              </Document>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
