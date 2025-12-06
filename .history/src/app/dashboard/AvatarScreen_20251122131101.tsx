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
      style={{
        backgroundImage: "url('/screen/floor.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "24px 24px",
        backgroundPosition: "top left",
      }}
    >
      {/* Overlay using absolute div instead of img so tiles remain visible */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/screen/back.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
