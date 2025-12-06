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
  googleBooksId?: string;
  pdfUrl?: string;
  abstract?: string;
}

export interface UserLibraryEntry {
  user_id: string;
  book_id: string;
  library_type: "leisure" | "research";
}

// --- Add a book to user's library ---
export async function addBookToLibrary(userId: string, book: Book) {
  // Make sure the book exists in the table
  await supabase.from("books").upsert({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    year: book.year,
    type: book.type,
    source: book.source,
    google_books_id: book.googleBooksId,
    pdf_url: book.pdfUrl,
  });

  // Add entry in user library
  const { data, error } = await supabase
    .from("user_library")
    .upsert({
      user_id: userId,
      book_id: book.id,
      library_type: book.type,
    })
    .select();

  if (error) console.error("Error adding to library:", error);
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
        google_books_id,
        pdf_url,
        abstract
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
