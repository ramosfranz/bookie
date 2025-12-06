"use client";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/leisure/all");
      const data = await res.json();
      if (data.success) setItems(data.data);
    }
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Leisure Library</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong> | Progress: {item.progress}% | Status: {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
