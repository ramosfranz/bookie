"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AvatarBuilder from "./AvatarBuilder";
import '../styles/pixelButton.css';
import { Pencil, Check, X } from "lucide-react";

const dummyUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
  // avatar settings
  skinTone: "#ffcc99",
  eyeColor: "#3a2e2e",
  hairColor: "#2f1b0c",
};

export default function ProfilePage() {
  const [user, setUser] = useState(dummyUser);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(user.username);

  const [avatarPopup, setAvatarPopup] = useState(false);

  const handleLogout = () => console.log("Logging out...");
  const handleDeactivate = () => {
    if (confirm("Are you sure you want to deactivate your account?")) {
      console.log("Account deactivated");
    }
  };

  const saveUsername = () => {
    setUser({ ...user, username: tempUsername });
    setIsEditingUsername(false);
  };

  return (
    <div className="min-h-screen flex bg-indigo-50">
      <Sidebar activeTab="profile" user={user} />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Profile</h1>

        <div className="bg-white rounded-xl shadow p-6 max-w-md relative">

          {/* Avatar Section */}
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-200 relative image-rendering-pixelated">

                {/* Layers */}
                <img
                  src="/avatar/skin.png"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: `brightness(0) saturate(100%) sepia(0%) drop-shadow(0 0 0 ${user.skinTone})` }}
                />
                <img src="/avatar/fit.png" className="absolute inset-0 w-full h-full" />
                <img
                  src="/avatar/eyes.png"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: `brightness(0) saturate(100%) sepia(100%) drop-shadow(0 0 0 ${user.eyeColor})` }}
                />
                <img
                  src="/avatar/hair.png"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: `brightness(0) saturate(100%) sepia(100%) drop-shadow(0 0 0 ${user.hairColor})` }}
                />
              </div>

              {/* Pencil icon */}
              <button
                className="absolute top-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                onClick={() => setAvatarPopup(true)}
              >
                <Pencil size={16} />
              </button>
            </div>

            {/* Username Section */}
            <div className="flex items-center gap-2">
              {isEditingUsername ? (
                <>
                  <input
                    className="border px-2 py-1 rounded"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                  />
                  <button className="text-green-600" onClick={saveUsername}><Check /></button>
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

            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Account Info</h3>
            <ul className="text-gray-700">
              <li><strong>ID:</strong> {user.id}</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleLogout} className="pixelButton">Log Out</button>
            <button onClick={handleDeactivate} className="pixelButton">Deactivate Account</button>
          </div>
        </div>
      </main>

      {/* Avatar Builder Popup */}
      {avatarPopup && (
        <AvatarBuilder
          initialData={{
            skinTone: user.skinTone,
            eyeColor: user.eyeColor,
            hairColor: user.hairColor,
          }}
          onClose={() => setAvatarPopup(false)}
          onSave={(newAvatar) => {
            setUser({ ...user, ...newAvatar });
            setAvatarPopup(false);
          }}
        />
      )}
    </div>
  );
}
