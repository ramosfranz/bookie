"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AvatarData {
  skinTone: string;
  eyeColor: string;
  hairColor: string;
}

interface AvatarBuilderProps {
  onClose: () => void;
  onSave: (data: AvatarData) => void;
  initialData: AvatarData;
}

export default function AvatarBuilder({
  onClose,
  onSave,
  initialData
}: AvatarBuilderProps) {
  const [skinTone, setSkinTone] = useState(initialData.skinTone);
  const [eyeColor, setEyeColor] = useState(initialData.eyeColor);
  const [hairColor, setHairColor] = useState(initialData.hairColor);

  const skinOptions = ["#ffdbb4", "#f1c27d", "#e0ac69", "#c68642", "#8d5524"];
  const eyeOptions = ["#c41a1a", "#000000", "#6b4f2c", "#2a7f2a", "#1e3f91"];
  const hairOptions = ["#ebba5e", "#c13037", "#6b4f2c", "#000000", "#ffffff"];
  const hairStyles = [1, 2, 3, 4, 5]; // visual only

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[700px] relative flex gap-6">

        {/* Close button */}
        <button className="absolute right-3 top-3" onClick={onClose}><X /></button>

        {/* Left column — Avatar Preview */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-40 h-40 image-rendering-pixelated">
            <img src="/avatar/skin.png" className="absolute inset-0 w-full h-full" style={{ filter: `drop-shadow(0 0 0 ${skinTone}) brightness(0) saturate(100%) sepia(0%)` }} />
            <img src="/avatar/fit.png" className="absolute inset-0 w-full h-full" />
            <img src="/avatar/eyes.png" className="absolute inset-0 w-full h-full" style={{ filter: `drop-shadow(0 0 0 ${eyeColor}) brightness(0) saturate(100%) sepia(100%)` }} />
            <img src="/avatar/hair.png" className="absolute inset-0 w-full h-full" style={{ filter: `drop-shadow(0 0 0 ${hairColor}) brightness(0) saturate(100%) sepia(100%)` }} />
          </div>
        </div>

        {/* Right column — Controls */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Skin color */}
          <div>
            <label className="font-semibold mb-1 block">Skin Color</label>
            <div className="flex gap-2">
              {skinOptions.map((color, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded cursor-pointer border-2 ${skinTone === color ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSkinTone(color)}
                />
              ))}
            </div>
          </div>

          {/* Eye color */}
          <div>
            <label className="font-semibold mb-1 block">Eye Color</label>
            <div className="flex gap-2">
              {eyeOptions.map((color, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded cursor-pointer border-2 ${eyeColor === color ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setEyeColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Hair color */}
          <div>
            <label className="font-semibold mb-1 block">Hair Color</label>
            <div className="flex gap-2">
              {hairOptions.map((color, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded cursor-pointer border-2 ${hairColor === color ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setHairColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Hairstyle — visual only */}
          <div>
            <label className="font-semibold mb-1 block">Hairstyle</label>
            <div className="flex gap-2">
              {hairStyles.map((style) => (
                <div
                  key={style}
                  className="w-8 h-8 rounded border-2 border-gray-300 flex items-center justify-center cursor-not-allowed opacity-50"
                  title="Not available yet"
                >
                  {style}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mt-4 gap-3">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button className="pixelButton" onClick={() => onSave({ skinTone, eyeColor, hairColor })}>Save Avatar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
