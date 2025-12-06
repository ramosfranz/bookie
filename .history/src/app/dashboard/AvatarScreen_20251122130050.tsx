"use client";

import React from "react";

interface AvatarPlaceholderProps {
  show: boolean;
  height?: string; // optional height override
}

export default function AvatarPlaceholder({
  show,
  height = "h-48",
}: AvatarPlaceholderProps) {
  if (!show) return null;

  return (
    <div
      className={`w-full rounded-xl shadow flex items-center justify-center mb-6 ${height}`}
      style={{
        backgroundImage: "url('/screen/tile.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "24px 24px", // ensures each tile stays 24x24px
        backgroundPosition: "top left",
      }}
    >
      {/* Optional overlay text */}
      <span className="text-gray-400">[User 2D Avatar Placeholder]</span>
    </div>
  );
}
