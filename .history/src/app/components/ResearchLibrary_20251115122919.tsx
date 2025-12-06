"use client";
import { useEffect, useState } from "react";

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

  async function fetchItems() {
    setLoading(true);
    const res = await fetch("/api/research/all");
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Research Library</h2>
      {loading && <p>Loading...</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong> | Authors: {item.authors?.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
