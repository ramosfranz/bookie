"use client";

import Sidebar from "../components/Sidebar";

const dummyUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
};

export default function ProfilePage() {
  const user = dummyUser;

  return (
    <div className="min-h-screen flex bg-indigo-50">
      {/* Sidebar */}
      <Sidebar activeTab="profile" user={user} />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Profile</h1>

        <div className="bg-white rounded-xl shadow p-6 max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Account Info</h3>
            <ul className="text-gray-700">
              <li><strong>ID:</strong> {user.id}</li>
              {/* You can add more account info here */}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
