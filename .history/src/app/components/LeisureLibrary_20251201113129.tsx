"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface LeisureItem {
  book_id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  progress?: number; // optional, if you track reading progress
  status?: string;   // optional, if you track status
}

export default function LeisureLibrary() {
  const [items, setItems] = useState<LeisureItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    setLoading(true);

    // Get the currently logged-in user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Auth error:", userError);
      setItems([]);
      setLoading(false);
      return;
    }
    const userId = userData.user.id;

    // Fetch the user's leisure library with book details
    const { data, error } = await supabase
      .from("user_library")
      .select(`
        library_type,
        books (
          id,
          title,
          author,
          cover,
          year
        )
      `)
      .eq("user_id", userId)
      .eq("library_type", "leisure")
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      setItems([]);
    } else {
      // Map the join results to LeisureItem[]
      setItems(
        (data as any[]).map((entry) => ({
          book_id: entry.books.id,
          title: entry.books.title,
          author: entry.books.author,
          cover: entry.books.cover,
          year: entry.books.year,
          progress: entry.books.progress ?? 0,
          status: entry.books.status ?? "Not started",
        }))
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadItems();

    // Realtime updates for this table
    const channel = supabase
      .channel("user_library_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_library",
        },
        () => {
          loadItems(); // refresh immediately
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Leisure Library</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your leisure library is empty.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.book_id} className="p-3 bg-white rounded shadow flex items-center gap-3">
              {item.cover && (
                <img src={item.cover} alt={item.title} className="w-12 h-16 object-cover rounded" />
              )}
              <div>
                <strong>{item.title}</strong>
                {item.author && <p className="text-sm text-gray-600">{item.author}</p>}
                <p className="text-sm text-gray-600">
                  Progress: {item.progress}% | Status: {item.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
