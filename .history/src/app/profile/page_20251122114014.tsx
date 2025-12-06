import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AvatarBuilder, { AvatarData } from "./AvatarBuilder";
import { Pencil, Check, X } from "lucide-react";

const dummyUser: AvatarData & { id: string; email: string; username: string } = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
  username: "TestUser",
  skin: null,
  eyes: null,
  hair: null,
  hairstyle: 1,
};

export default function ProfilePage() {
  const [user, setUser] = useState(dummyUser);
  const [avatarPopup, setAvatarPopup] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(user.username);

  return (
    <div className="min-h-screen flex bg-indigo-50">
      <Sidebar activeTab="profile" user={user} />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Profile</h1>

        <div className="bg-white rounded-xl shadow p-6 max-w-md relative">
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-200 relative image-rendering-pixelated">
                <img src="/avatar/skin.png" className="absolute inset-0 w-full h-full" style={{ filter: user.skin?.filter || "" }} />
                <img src="/avatar/fit.png" className="absolute inset-0 w-full h-full" />
                <img src="/avatar/eyes.png" className="absolute inset-0 w-full h-full" style={{ filter: user.eyes?.filter || "" }} />
                <img src="/avatar/hair.png" className="absolute inset-0 w-full h-full" style={{ filter: user.hair?.filter || "" }} />
              </div>

              <button className="absolute top-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer" onClick={() => setAvatarPopup(true)}>
                <Pencil size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isEditingUsername ? (
                <>
                  <input className="border px-2 py-1 rounded" value={tempUsername} onChange={(e) => setTempUsername(e.target.value)} />
                  <button className="text-green-600" onClick={() => { setUser({ ...user, username: tempUsername }); setIsEditingUsername(false); }}><Check /></button>
                  <button className="text-red-600" onClick={() => { setTempUsername(user.username); setIsEditingUsername(false); }}><X /></button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <button className="text-gray-600 hover:text-black" onClick={() => setIsEditingUsername(true)}><Pencil size={18} /></button>
                </>
              )}
            </div>

            <p className="text-gray-600">{user.email}</p>
          </div>

          {avatarPopup && (
            <AvatarBuilder
              onClose={() => setAvatarPopup(false)}
              onSave={(newAvatar) => { setUser({ ...user, ...newAvatar }); setAvatarPopup(false); }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
