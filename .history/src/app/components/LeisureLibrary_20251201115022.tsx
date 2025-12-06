"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Heart, Trash2 } from "lucide-react";

interface LeisureItem {
  book_id: string;
  title: string;
  author?: string;
  cover?: string;
  year?: number;
  progress?: number;
  status?: string;
}


export default function LeisureLibrary() {
  const [items, setItems] = useState<LeisureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Auth error:", userError);
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

  async function handleDelete(book_id: string) {
    const { data, error } = await supabase
      .from("user_library")
      .delete()
      .eq("book_id", book_id);

    if (error) console.error("Delete error:", error);
    else loadItems();
  }

  useEffect(() => {
    loadItems();

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
          loadItems();
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
            <li
  key={item.book_id}
  className="p-3 bg-white rounded shadow flex items-center gap-3 relative"
>
  {item.cover && (
    <img
      src={item.cover}
      alt={item.title}
      className="w-12 h-16 object-cover rounded"
    />
  )}
  <div className="flex-1">
    <strong>{item.title}</strong>
    {item.author && (
      <p className="text-sm text-gray-600">{item.author}</p>
    )}
    <p className="text-sm text-gray-600">
      Progress: {item.progress}% | Status: {item.status}
    </p>

    {/* Buttons row */}
    <div className="mt-1 flex items-center gap-2">
      {/* Read button */}
      <button
        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        onClick={() => alert(`Read ${item.title}`)}
      >
        Read
      </button>

      {/* Heart / Favorite */}
      <button className="text-red-500 hover:text-red-600">
        <Heart size={16} />
      </button>

      {/* Pin / Bookmark */}
      <button className="text-yellow-500 hover:text-yellow-600">
        📌
      </button>
    </div>
  </div>

  {/* Three dots menu */}
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
    </div>
  );
}
