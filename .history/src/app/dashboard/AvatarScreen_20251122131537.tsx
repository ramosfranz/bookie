"use client";

import React from "react";

interface AvatarPlaceholderProps {
  show: boolean;
  height?: string;
}

export default function AvatarPlaceholder({
  show,
  height = "h-48",
}: AvatarPlaceholderProps) {
  if (!show) return null;

  return (
    <div
      className={`w-full rounded-xl shadow mb-6 relative ${height} overflow-hidden`}
    >
      {/* Floor tiles */}
      <img
        src="/screen/floor.png"
        className="absolute inset-0 w-full h-full"
        style={{
          imageRendering: "pixelated",
          objectFit: "repeat",
          objectPosition: "top left",
        }}
      />

      {/* Overlay */}
      <img
        src="/screen/back.png"
        className="absolute inset-0 w-full h-full"
        style={{
          imageRendering: "pixelated",
          objectFit: "contain",
          objectPosition: "center",
        }}
      />

      {/* Optional overlay text */}
      <span className="absolute inset-0 flex items-center justify-center text-gray-400">
        [User 2D Avatar Placeholder]
      </span>
    </div>
  );
}
