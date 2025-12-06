"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import AvatarBuilder from "./AvatarBuilder";
import "../styles/pixelButton.css";
import { Pencil, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import "../styles/background.css";

interface AvatarData {
  skinTone: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  hairstyle?: number;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  const [avatarPopup, setAvatarPopup] = useState(false);

  // LOAD USER + PROFILE ON MOUNT
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
        setUser(profile);
        setTempUsername(profile.username || "");
      }
    };

    loadUser();
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  // SAVE USERNAME TO SUPABASE
  const saveUsername = async () => {
    await supabase
      .from("profiles")
      .update({ username: tempUsername })
      .eq("id", user.id);

    setUser({ ...user, username: tempUsername });
    setIsEditingUsername(false);
  };

  // SAVE AVATAR TO SUPABASE
  const saveAvatar = async (avatar: AvatarData) => {
    await supabase.from("profiles").update(avatar).eq("id", user.id);
    setUser({ ...user, ...avatar });
  };

  // LOG OUT FUNCTION
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // redirect after logout
  };

  return (
    <div className="min-h-screen flex bookieBackground">
      <Sidebar activeTab="profile" user={user} />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#f67129" }}>Profile</h1>

        <div className="bg-white rounded-xl shadow p-6 max-w-md relative">

          {/* AVATAR DISPLAY */}
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-200 relative image-rendering-pixelated">

                <img
                  src="/avatar/skin.png"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: user.skinTone || "" }}
                />
                <img
                  src="/avatar/fit.png"
                  className="absolute inset-0 w-full h-full"
                />
                <img
                  src="/avatar/eyes.png"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: user.eyeColor || "" }}
                />
                <img
                  src="/avatar/hair.png"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: user.hairColor || "" }}
                />
              </div>

              <button
                className="absolute top-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                onClick={() => setAvatarPopup(true)}
              >
                <Pencil size={16} />
              </button>
            </div>

            {/* USERNAME */}
            <div className="flex items-center gap-2">
              {isEditingUsername ? (
                <>
                  <input
                    className="border px-2 py-1 rounded"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                  />
                  <button className="text-green-600" onClick={saveUsername}>
                    <Check />
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => {
                      setTempUsername(user.username);
                      setIsEditingUsername(false);
                    }}
                  >
                    <X />
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <button
                    className="text-gray-600 hover:text-black"
                    onClick={() => setIsEditingUsername(true)}
                  >
                    <Pencil size={18} />
                  </button>
                </>
              )}
            </div>

            {/* EMAIL */}
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* LOG OUT BUTTON */}
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleLogout} className="pixelButton">
              Log Out
            </button>
          </div>
        </div>
      </main>

      {/* AVATAR POPUP */}
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
