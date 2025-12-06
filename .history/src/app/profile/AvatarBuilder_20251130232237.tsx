"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface AvatarData {
  skinTone: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  hairstyle: number;
}

interface AvatarBuilderProps {
  onClose: () => void;
  onSave: (data: AvatarData) => void;
}

export default function AvatarBuilder({ onClose, onSave }: AvatarBuilderProps) {
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [eyeColor, setEyeColor] = useState<string | null>(null);
  const [hairColor, setHairColor] = useState<string | null>(null);
  const [hairstyle, setHairstyle] = useState<number>(1);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Load username/email from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setUsername(storedUsername);
    setEmail(storedEmail);
  }, []);

  // Skin, eye, hair options remain the same...
  const skinOptions = [null, "#f1c27d", "#e0ac69", "#c68642", "#8d5524"];
  const skinBoxColors = ["#ffdbb4", "#d5b48b", "#a38d6a", "#5c4a3d", "#322c20"];
  const skinFilters = ["", "hue-rotate(10deg) saturate(142%) brightness(84%)", "hue-rotate(10deg) saturate(142%) brightness(65%)", "hue-rotate(10deg) saturate(142%) brightness(36%)", "hue-rotate(10deg) saturate(142%) brightness(20%)"];
  const eyeOptions = [null, "#000000", "#6b4f2c", "#1d6616", "#7fdf59"];
  const eyeBoxColors = ["#c41a1a", "#000000", "#1d6616", "#5734df", "#6b4c16"];
  const eyeFilters = ["", "", "", "", ""];
  const hairOptions = [null, "#c13037", "#6b4f2c", "#000000", "#ffffff"];
  const hairBoxColors = ["#ebba5e", "#44352b", "#9c6604", "#ff9eb4", "#c1c1c1"];
  const hairFilters = ["", "", "", "", ""];
  const hairStyles = [1, 2, 3, 4, 5];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[700px] relative flex gap-6">

        <button className="absolute right-3 top-3" onClick={onClose}><X /></button>

        {/* Left column — Avatar Preview */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Username: {username}</h2>
          <h3 className="text-sm text-gray-600 mb-4">Email: {email}</h3>
          <div className="relative w-40 h-40 image-rendering-pixelated">
            <img src="/avatar/skin.png" className="absolute inset-0 w-full h-full" style={{ filter: skinTone === null ? "" : skinFilters[skinOptions.indexOf(skinTone)] }} />
            <img src="/avatar/fit.png" className="absolute inset-0 w-full h-full" />
            <img src="/avatar/eyes.png" className="absolute inset-0 w-full h-full" style={{ filter: eyeColor === null ? "" : eyeFilters[eyeOptions.indexOf(eyeColor)] }} />
            <img src="/avatar/hair.png" className="absolute inset-0 w-full h-full" style={{ filter: hairColor === null ? "" : hairFilters[hairOptions.indexOf(hairColor)] }} />
          </div>
        </div>

        {/* Right column — Controls */}
        <div className="flex-1 flex flex-col gap-4">
          {/* ... skin, eye, hair, hairstyle controls remain unchanged ... */}

          {/* Action buttons */}
          <div className="flex justify-end mt-4 gap-3">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button
              className="pixelButton"
              onClick={() =>
                onSave({
                  skinTone: skinTone === null ? null : skinFilters[skinOptions.indexOf(skinTone)],
                  eyeColor: eyeColor === null ? null : eyeFilters[eyeOptions.indexOf(eyeColor)],
                  hairColor: hairColor === null ? null : hairFilters[hairOptions.indexOf(hairColor)],
                  hairstyle,
                })
              }
            >
              Save Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
