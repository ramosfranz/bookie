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

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [avatarPopup, setAvatarPopup] = useState(false);

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
    };

    loadUser();
  }, []);

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

  return (
    <div className="min-h-screen flex bookieBackground">
      <Sidebar activeTab="profile" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
          <h1
            className="text-2xl md:text-3xl font-bold mb-4 text-center"
            style={{ color: "#f67129" }}
          >
            My Profile
          </h1>

          {/* ID CARD */}
          <div className="border-2 border-gray-200 rounded-lg p-4 md:p-6 mb-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
              {/* AVATAR */}
              <div className="relative flex-shrink-0 self-center md:self-auto">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-purple-200 relative image-rendering-pixelated border-2 border-gray-300">
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
                  className="absolute -bottom-2 -right-2 bg-[#f67129] text-white p-2 rounded-full shadow-lg hover:bg-[#e55f1f] transition"
                  onClick={() => setAvatarPopup(true)}
                >
                  <Pencil size={16} />
                </button>
              </div>

              {/* USER INFO */}
              <div className="flex-1">
                {/* USERNAME + LEVEL */}
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  {isEditingUsername ? (
                    <div className="flex gap-2 flex-1 min-w-[120px]">
                      <input
                        className="border px-2 py-1 rounded flex-1"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                      />
                      <button
                        className="text-green-600 hover:text-green-700"
                        onClick={saveUsername}
                      >
                        <Check size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setTempUsername(user.username);
                          setIsEditingUsername(false);
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-xl md:text-2xl font-bold">{user.username}</h2>
                      <p className="text-lg font-semibold text-[#f67129]">
                        Level {user.level || 1}
                      </p>
                      <button
                        className="text-gray-600 hover:text-[#f67129]"
                        onClick={() => setIsEditingUsername(true)}
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* EMAIL + PASSWORD */}
                <div className="flex flex-col md:flex-row gap-4 mb-2 flex-wrap">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Email
                    </label>
                    <p className="text-gray-700 break-all">{user.email}</p>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Password
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700">It's a secret!</p>
                      <button className="text-[#f67129] text-sm hover:underline">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BIO */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500 uppercase font-semibold">
                  Biography
                </label>
                {!isEditingBio && (
                  <button
                    className="text-gray-600 hover:text-[#f67129]"
                    onClick={() => setIsEditingBio(true)}
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
              {isEditingBio ? (
                <div>
                  <textarea
                    className="border px-2 py-1 rounded w-full resize-none"
                    rows={3}
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      onClick={saveBio}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
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
                <p className="text-gray-700 italic">
                  {user.bio || "No biography yet. Click the pencil icon to add one!"}
                </p>
              )}
            </div>

            {/* FAVORITE BOOKS */}
            <div>
              <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">
                Favorite Books
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/8] md:aspect-[1/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#f67129] transition cursor-pointer"
                  >
                    <BookOpen size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2 md:gap-3 mt-4">
              <button onClick={handleLogout} className="pixelButton">
                Log Out
              </button>
              <button
                onClick={handleDeactivate}
                className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
              >
                Deactivate Account
              </button>
            </div>
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
