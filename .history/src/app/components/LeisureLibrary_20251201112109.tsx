"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface LeisureItem {
  id: string;
  user_id: string;
  book_id: string;
  title: string;
  progress: number;
  status: string;
}

export default function LeisureLibrary() {
  const [items, setItems] = useState<LeisureItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch function extracted so it can be reused (e.g., live updates)
  async function loadItems() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("library")
      .select("*")
      .eq("user_id", user.id)
      .eq("category", "leisure")
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    setItems(data as LeisureItem[]);
    setLoading(false);
  }

  useEffect(() => {
    loadItems(); // initial fetch

    // 🔥 REAL-TIME LISTENER — refresh whenever the table changes
    const channel = supabase
      .channel("library-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "library",
        },
        () => {
          loadItems(); // refresh immediately
        }
      )
      .subscribe();

    // cleanup
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
            <li key={item.id} className="p-3 bg-white rounded shadow">
              <strong>{item.title}</strong>
              <div className="text-sm text-gray-600">
                Progress: {item.progress}% <br />
                Status: {item.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
