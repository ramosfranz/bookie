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

  useEffect(() => {
    async function fetchItems() {
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch library entries for this user, category = leisure
      const { data, error } = await supabase
        .from("library")
        .select("*")
        .eq("user_id", user.id)
        .eq("category", "leisure");

      if (error) console.error(error);
      else setItems(data as LeisureItem[]);

      setLoading(false);
    }

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Leisure Library</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Your leisure library is empty.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="mb-2">
              <strong>{item.book_id}</strong> — {item.title}  
              <br />
              Progress: {item.progress}% | Status: {item.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
