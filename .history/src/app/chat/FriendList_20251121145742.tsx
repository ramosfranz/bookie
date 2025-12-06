// FriendList.tsx
"use client";

interface Friend {
  id: string;
  name: string;
  avatar: string;
}

interface FriendListProps {
  friends: Friend[];
  onAdd: (friend: Friend) => void;
  onClose?: () => void; // optional close button
}

export default function FriendList({ friends, onAdd, onClose }: FriendListProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-lg w-[320px] p-4 shadow-xl relative">
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            ✖️
          </button>
        )}
        <h3 className="text-lg font-semibold mb-3">Add Members</h3>
        {friends.length === 0 ? (
          <p className="text-gray-500 text-sm">No available friends.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="p-2 flex justify-between items-center bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{friend.avatar}</span>
                  <span>{friend.name}</span>
                </span>
                <button
                  className="text-green-600 font-semibold hover:text-green-800"
                  onClick={() => onAdd(friend)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
