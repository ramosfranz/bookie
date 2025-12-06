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
}

export default function FriendList({ friends, onAdd }: FriendListProps) {
  return (
    <div className="border rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto mb-3">
      {friends.length === 0 ? (
        <p className="text-gray-500 text-sm">No friends available to add.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between p-2 bg-white rounded-lg border hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{friend.avatar}</span>
                <span>{friend.name}</span>
              </div>
              <button
                className="text-green-600 font-semibold hover:text-green-800"
                onClick={() => onAdd(friend)}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
