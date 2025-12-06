"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import '../styles/pixelButton.css';

import { Pencil, Check, X } from "lucide-react";

const dummyUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
  avatar: "" // placeholder
};

export default function ProfilePage() {
  const [user, setUser] = useState(dummyUser);

  // Username edit mode states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(user.username);

  // Avatar popup state
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
              <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center text-4xl">
                👤
              </div>

              {/* Pencil icon on avatar */}
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

                  <button
                    className="text-green-600"
                    onClick={saveUsername}
                  >
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

            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Account Info</h3>
            <ul className="text-gray-700">
              <li><strong>ID:</strong> {user.id}</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleLogout} className="pixelButton">
              Log Out
            </button>
            <button onClick={handleDeactivate} className="pixelButton">
              Deactivate Account
            </button>
          </div>
        </div>
      </main>

      {/* Avatar Edit Popup */}
      {avatarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Edit Avatar</h2>

            <p className="text-gray-600 mb-4">Upload or select a new avatar.</p>

            <input type="file" className="mb-4" />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setAvatarPopup(false)}
              >
                Cancel
              </button>
              <button
                className="pixelButton"
                onClick={() => {
                  setAvatarPopup(false);
                }}
              >
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
