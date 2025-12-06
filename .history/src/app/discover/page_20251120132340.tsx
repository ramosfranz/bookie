"use client";

import { useState } from "react";
import { BookOpen, Star, TrendingUp } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function DiscoverPage() {

   const user = dummyUser;
      const [activeTab, setActiveTab] = useState<
      "research" | "leisure" | "discover" | "chat"
    >("research");
    const [researchLibrary, setResearchLibrary] = useState(initialResearchLibrary);
    const [leisureLibrary, setLeisureLibrary] = useState(initialLeisureLibrary);

  const [recommended] = useState([
    {
      id: 1,
      title: "Modern Web Security",
      url: "https://example.com/book1",
    },
    {
      id: 2,
      title: "AI & Society",
      url: "https://example.com/book2",
    },
    {
      id: 3,
      title: "Next.js Patterns",
      url: "https://example.com/book3",
    },
  ]);

  const [trending] = useState([
    {
      id: 4,
      title: "Phishing Detection Trends 2024",
      url: "https://example.com/research1",
    },
    {
      id: 5,
      title: "Hybrid Deep Learning Models",
      url: "https://example.com/research2",
    },
  ]);

  const [recent] = useState([
    {
      id: 6,
      title: "Database Indexing Essentials",
      url: "https://example.com/book4",
    },
  ]);

  return (
    <div className="p-6">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Discover</h1>

      {/* Recommended */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Star className="text-yellow-500 w-6 h-6" />
          <h2 className="text-2xl font-semibold">Recommended For You</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recommended.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <BookOpen className="w-12 h-12 text-purple-600 mb-3" />
              <p className="font-medium text-center">{item.title}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="text-red-500 w-6 h-6" />
          <h2 className="text-2xl font-semibold">Trending Research</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {trending.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <BookOpen className="w-12 h-12 text-purple-600 mb-3" />
              <p className="font-medium text-center">{item.title}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="text-blue-500 w-6 h-6" />
          <h2 className="text-2xl font-semibold">Recently Added</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recent.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <BookOpen className="w-12 h-12 text-purple-600 mb-3" />
              <p className="font-medium text-center">{item.title}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
