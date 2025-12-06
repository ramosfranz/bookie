"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AvatarData } from "../profile/AvatarBuilder";

export default function Sidebar({ activeTab }: { activeTab: string }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [avatarData, setAvatarData] = useState<AvatarData>({
    skinTone: null,
    eyeColor: null,
    hairColor: null,
    hairstyle: 1,
  });

  // Load username + avatar from Supabase
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const baseUsername = user.email?.split("@")[0] ?? "";

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setUsername(profile?.username || baseUsername);
      setAvatarData(profile?.avatar || avatarData);
    }

    loadProfile();
  }, []);

  const handleLinkClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <aside
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={`${isCollapsed ? "w-[70px]" : "w-[180px]"} bg-white shadow-lg p-4 flex flex-col items-center transition-all duration-300 cursor-pointer`}
    >
      {/* Profile Section */}
      <Link href="/profile" onClick={handleLinkClick} className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden relative image-rendering-pixelated">
          <div className="absolute w-full h-full" style={{ transform: "translateY(+50%) scale(1.5)" }}>
            <img src="/avatar/skin.png" className="absolute inset-0 w-full h-full" style={{ filter: avatarData.skinTone || "" }} />
            <img src="/avatar/fit.png" className="absolute inset-0 w-full h-full" />
            <img src="/avatar/eyes.png" className="absolute inset-0 w-full h-full" style={{ filter: avatarData.eyeColor || "" }} />
            <img src="/avatar/hair.png" className="absolute inset-0 w-full h-full" style={{ filter: avatarData.hairColor || "" }} />
          </div>
        </div>

        {!isCollapsed && <p className="mt-3 font-semibold text-purple-700">{username}</p>}
      </Link>

      <div className="w-full border-t my-4"></div>

      {/* Tabs */}
      <nav className="flex flex-col items-center gap-6 mt-4">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className={`flex flex-col items-center text-xl ${activeTab === "dashboard" ? "text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          📚 {!isCollapsed && <span className="text-sm mt-1">Library</span>}
        </Link>

        <Link
          href="/discover"
          onClick={handleLinkClick}
          className={`flex flex-col items-center text-xl ${activeTab === "discover" ? "text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          🔍 {!isCollapsed && <span className="text-sm mt-1">Discover</span>}
        </Link>

        <Link
          href="/chat"
          onClick={handleLinkClick}
          className={`flex flex-col items-center text-xl ${activeTab === "chat" ? "text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          💬 {!isCollapsed && <span className="text-sm mt-1">Chat</span>}
        </Link>
      </nav>
    </aside>
  );
}
