"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import AvatarBuilder from "./AvatarBuilder";
import "../styles/pixelButton.css";
import { Pencil, Check, X, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import "../styles/background.css";

interface AvatarData {
  skinTone: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  hairstyle?: number;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  skinTone: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  hairstyle?: number;
  bio?: string;
  level?: number;
}

interface FavoriteBook {
  book_id: string;
  books: {
    id: string;
    title: string;
    author?: string;
    cover?: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [avatarPopup, setAvatarPopup] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState<FavoriteBook[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        const typedProfile = profile as UserProfile;
        setUser(typedProfile);
        setTempUsername(typedProfile.username || "");
        setTempBio(typedProfile.bio || "");
      }

      // Load favorite books
      loadFavoriteBooks(authUser.id);
    };

    loadUser();
  }, []);

  const loadFavoriteBooks = async (userId: string) => {
    setLoadingFavorites(true);
    const { data, error } = await supabase
      .from("user_favorites")
      .select(`
        book_id,
        books (
          id,
          title,
          author,
          cover
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error loading favorites:", error);
    } else if (data) {
      setFavoriteBooks(data as FavoriteBook[]);
    }
    setLoadingFavorites(false);
  };

  if (!user)
    return (
      <p className="p-6 text-center text-gray-700">
        Loading your profile...
      </p>
    );

  const saveUsername = async () => {
    await supabase
      .from("profiles")
      .update({ username: tempUsername })
      .eq("id", user.id);
    setUser({ ...user, username: tempUsername });
    setIsEditingUsername(false);
  };

  const saveBio = async () => {
    await supabase
      .from("profiles")
      .update({ bio: tempBio })
      .eq("id", user.id);
    setUser({ ...user, bio: tempBio });
    setIsEditingBio(false);
  };

  const saveAvatar = async (avatar: AvatarData) => {
    await supabase.from("profiles").update(avatar).eq("id", user.id);
    setUser({ ...user, ...avatar });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeactivate = async () => {
    if (
      confirm(
        "Are you sure you want to deactivate your account? This action cannot be undone."
      )
    ) {
      await supabase.auth.signOut();
      router.push("/");
    }
  };

  // Render empty slots for remaining favorites
  const emptySlots = Math.max(0, 6 - favoriteBooks.length);

  return (
    <div className="min-h-screen flex bookieBackground">
      <Sidebar activeTab="profile" />

      <main className="flex-1 flex items-center justify-center p-2 md:p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] overflow-hidden flex flex-col p-4 md:p-6">
          <h1
            className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center flex-shrink-0"
            style={{ color: "#f67129" }}
          >
            My Profile
          </h1>

          <div className="flex-1 overflow-auto">
            {/* ID CARD */}
            <div className="border-2 border-gray-200 rounded-lg p-2 md:p-4 mb-2 md:mb-4 flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                {/* AVATAR */}
                <div className="relative flex-shrink-0 self-center md:self-auto">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden bg-purple-200 relative image-rendering-pixelated border-2 border-gray-300">
                    <img
                      src="/avatar/skin.png"
                      alt="Avatar skin"
                      className="absolute inset-0 w-full h-full"
                      style={{ filter: user.skinTone || "" }}
                    />
                    <img
                      src="/avatar/fit.png"
                      alt="Avatar outfit"
                      className="absolute inset-0 w-full h-full"
                    />
                    <img
                      src="/avatar/eyes.png"
                      alt="Avatar eyes"
                      className="absolute inset-0 w-full h-full"
                      style={{ filter: user.eyeColor || "" }}
                    />
                    <img
                      src="/avatar/hair.png"
                      alt="Avatar hair"
                      className="absolute inset-0 w-full h-full"
                      style={{ filter: user.hairColor || "" }}
                    />
                  </div>
                  <button
                    className="absolute -bottom-2 -right-2 bg-[#f67129] text-white p-1 md:p-2 rounded-full shadow-lg hover:bg-[#e55f1f] transition"
                    onClick={() => setAvatarPopup(true)}
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                {/* USER INFO */}
                <div className="flex-1 flex flex-col justify-between">
                  {/* USERNAME + LEVEL */}
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    {isEditingUsername ? (
                      <div className="flex gap-1 flex-1 min-w-[120px]">
                        <input
                          className="border px-2 py-1 rounded flex-1 text-sm"
                          value={tempUsername}
                          onChange={(e) => setTempUsername(e.target.value)}
                        />
                        <button
                          className="text-green-600 hover:text-green-700"
                          onClick={saveUsername}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setTempUsername(user.username);
                            setIsEditingUsername(false);
                          }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full text-sm md:text-base">
                        <h2 className="font-bold">{user.username}</h2>
                        <p className="font-semibold text-[#f67129]">
                          Level {user.level || 1}
                        </p>
                        <button
                          className="text-gray-600 hover:text-[#f67129]"
                          onClick={() => setIsEditingUsername(true)}
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* EMAIL + PASSWORD */}
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-xs md:text-sm">
                    <div className="flex-1">
                      <label className="text-gray-500 uppercase font-semibold">
                        Email
                      </label>
                      <p className="text-gray-700 break-all">{user.email}</p>
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-500 uppercase font-semibold">
                        Password
                      </label>
                      <div className="flex items-center gap-1">
                        <p className="text-gray-700">It's a secret!</p>
                        <button className="text-[#f67129] hover:underline text-xs">
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BIO */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-500 uppercase font-semibold text-xs">
                    Biography
                  </label>
                  {!isEditingBio && (
                    <button
                      className="text-gray-600 hover:text-[#f67129]"
                      onClick={() => setIsEditingBio(true)}
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                </div>
                {isEditingBio ? (
                  <div>
                    <textarea
                      className="border px-2 py-1 rounded w-full resize-none text-xs md:text-sm"
                      rows={3}
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                        onClick={saveBio}
                      >
                        Save
                      </button>
                      <button
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                        onClick={() => {
                          setTempBio(user.bio || "");
                          setIsEditingBio(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 italic text-xs md:text-sm">
                    {user.bio || "No biography yet. Click the pencil icon to add one!"}
                  </p>
                )}
              </div>

              {/* FAVORITE BOOKS */}
              <div className="mt-2">
                <label className="text-gray-500 uppercase font-semibold text-xs mb-1 block">
                  Favorite Books
                </label>
                {loadingFavorites ? (
                  <p className="text-gray-500 text-xs">Loading favorites...</p>
                ) : (
                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {/* Display actual favorite books */}
                    {favoriteBooks.map((fav) => (
                      <div
                        key={fav.book_id}
                        className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-[#f67129] transition cursor-pointer relative group"
                        title={fav.books.title}
                      >
                        {fav.books.cover ? (
                          <img
                            src={fav.books.cover}
                            alt={fav.books.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <BookOpen size={20} className="text-[#f67129]" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Display empty slots */}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="w-16 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                      >
                        <BookOpen size={16} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-1 md:gap-2 mt-2 flex-shrink-0">
            <button onClick={handleLogout} className="pixelButton text-sm">
              Log Out
            </button>
            <button
              onClick={handleDeactivate}
              className="w-full px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </main>

      {avatarPopup && (
        <AvatarBuilder
          onClose={() => setAvatarPopup(false)}
          onSave={(avatarData) => {
            saveAvatar(avatarData);
            setAvatarPopup(false);
          }}
        />
      )}
    </div>
  );
}