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
      className={`w-full rounded-xl shadow mb-6 relative ${height} overflow-hidden`}
      style={{
        backgroundImage: "url('/screen/floor.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "24px 24px",
        backgroundPosition: "top left",
      }}
    >
      {/* Overlay image */}
      <img
        src="/screen/back.png"
        alt="Overlay"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Optional placeholder text if needed */}
      {/* <span className="absolute inset-0 flex items-center justify-center text-gray-400">
        [User 2D Avatar Placeholder]
      </span> */}
    </div>
  );
}
