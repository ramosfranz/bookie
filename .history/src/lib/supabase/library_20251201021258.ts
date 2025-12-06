import { supabase } from "./client";
import type { Book } from "@/types/book";

export async function addBookToLibrary(userId: string, book: Book) {
  // Upsert the book in the books table
  await supabase.from("books").upsert({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    year: book.year,
    type: book.type,
    source: book.source,
    google_books_id: book.googleBooksId,
    pdf_url: book.pdfUrl
  });

  // Insert into user_library
  const { data, error } = await supabase.from("user_library").insert({
    user_id: userId,
    book_id: book.id,
    library_type: book.type
  }).select();

  if (error) console.error("Error adding to library:", error);
  return data;
}

export async function getUserLibrary(userId: string, libraryType: "leisure" | "research") {
  const { data, error } = await supabase
    .from("user_library")
    .select("books(*)")
    .eq("user_id", userId)
    .eq("library_type", libraryType);

  if (error) console.error("Error fetching library:", error);
  return data?.map((row: any) => row.books) || [];
}
