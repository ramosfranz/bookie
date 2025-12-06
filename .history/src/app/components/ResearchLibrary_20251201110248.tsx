"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface ResearchItem {
  id: string;
  user_id: string;
  title: string;
  pdf_url?: string;
  authors?: string[];
  tags?: string[];
}

export default function ResearchLibrary() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Load logged-in user
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    loadUser();
  }, []);

  // Load Research Library from Supabase
  useEffect(() => {
    async function fetchItems() {
      if (!userId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("research_library")
        .select("*")
        .eq("user_id", userId);

      if (!error && data) setItems(data);

      setLoading(false);
    }

    fetchItems();
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Research Library</h2>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p>No research items found.</p>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border rounded p-3 bg-white shadow"
          >
            <strong>{item.title}</strong>

            {item.authors && (
              <p className="text-sm text-gray-600">
                Authors: {item.authors.join(", ")}
              </p>
            )}

            {item.tags && (
              <p className="text-sm text-gray-500">
                Tags: {item.tags.join(", ")}
              </p>
            )}

            {item.pdf_url && (
              <a
                href={item.pdf_url}
                target="_blank"
                className="text-blue-600 underline text-sm"
              >
                View PDF
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
