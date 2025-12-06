import { supabase } from "@/lib/supabase/client";

// --- TypeScript interfaces ---
export interface Book {
  id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  type: "leisure" | "research";
  source: "gutendex" | "openlibrary" | "googlebooks" | "arxiv";
  formats?: { [key: string]: string };   // <-- added for Gutendex/OpenLibrary
  googleBooksId?: string;                // <-- Google Books
  pdfUrl?: string;                       // <-- arXiv
  abstract?: string;
  progress?: number;                     // optional reading progress
  status?: string;                       // optional status
}

export interface UserLibraryEntry {
  user_id: string;
  book_id: string;
  library_type: "leisure" | "research";
}

// --- Add a book to user's library ---
export async function addBookToLibrary(userId: string, book: Book) {
  const { error: bookError } = await supabase.from("books").upsert({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    year: book.year,
    type: book.type,
    source: book.source,
    formats: book.formats ?? {},               // ensure JSONB is not undefined
    google_books_id: book.googleBooksId ?? null,
    pdf_url: book.pdfUrl ?? null,
    abstract: book.abstract ?? null,
    progress: book.progress ?? 0,
    status: book.status ?? "Not started",
  });

  if (bookError) {
    console.error("Error upserting book:", bookError);
    return null;
  }

  const { data, error } = await supabase
    .from("user_library")
    .upsert({
      user_id: userId,
      book_id: book.id,
      library_type: book.type,
    })
    .select();

  if (error) {
    console.error("Error adding to library:", error);
    return null;
  }

  return data;
}


// --- Fetch a user's library ---
export async function getUserLibrary(userId: string) {
  const { data, error } = await supabase
    .from("user_library")
    .select(`
      book_id,
      library_type,
      books (
        id,
        title,
        author,
        cover,
        year,
        type,
        source,
        formats,              -- <-- include formats
        google_books_id,
        pdf_url,
        abstract,
        progress,
        status
      )
    `)
    .eq("user_id", userId);

  if (error) console.error("Error fetching library:", error);

  return data?.map((entry: any) => ({
    ...entry.books,
    library_type: entry.library_type,
  }));
}

// --- Remove a book from user's library ---
export async function removeBookFromLibrary(userId: string, bookId: string) {
  const { data, error } = await supabase
    .from("user_library")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .select();

  if (error) console.error("Error removing from library:", error);
  return data;
}

// --- Check if book exists in library ---
export async function isBookInLibrary(userId: string, bookId: string) {
  const { data, error } = await supabase
    .from("user_library")
    .select()
    .eq("user_id", userId)
    .eq("book_id", bookId);

  if (error) {
    console.error("Error checking library:", error);
    return false;
  }

  return data && data.length > 0;
}
