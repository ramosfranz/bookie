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

  const [skinTone, setSkinTone] = useState(initialData.skinTone || "#ffcc99");
  const [eyeColor, setEyeColor] = useState(initialData.eyeColor || "#3a2e2e");
  const [hairColor, setHairColor] = useState(initialData.hairColor || "#2f1b0c");

  const filterSkin = `brightness(0) saturate(100%) sepia(0%) drop-shadow(0 0 0 ${skinTone})`;
  const filterEye = `brightness(0) saturate(100%) sepia(100%) drop-shadow(0 0 0 ${eyeColor})`;
  const filterHair = `brightness(0) saturate(100%) sepia(100%) drop-shadow(0 0 0 ${hairColor})`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[380px] relative">

        {/* Close button */}
        <button className="absolute right-3 top-3" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-4">Customize Avatar</h2>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40 image-rendering-pixelated">

            {/* Layer 1 — Skin */}
            <img
              src="/avatar/skin.png"
              className="absolute inset-0 w-full h-full"
              style={{ filter: filterSkin }}
            />

            {/* Layer 2 — Outfit */}
            <img
              src="/avatar/fit.png"
              className="absolute inset-0 w-full h-full"
            />

            {/* Layer 3 — Eyes */}
            <img
              src="/avatar/eyes.png"
              className="absolute inset-0 w-full h-full"
              style={{ filter: filterEye }}
            />

            {/* Layer 4 — Hair */}
            <img
              src="/avatar/hair.png"
              className="absolute inset-0 w-full h-full"
              style={{ filter: filterHair }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="grid gap-4">

          {/* Skin Tone */}
          <div>
            <label className="font-semibold">Skin Tone</label>
            <input
              type="color"
              className="w-full h-10 rounded"
              value={skinTone}
              onChange={(e) => setSkinTone(e.target.value)}
            />
          </div>

          {/* Eye Color */}
          <div>
            <label className="font-semibold">Eye Color</label>
            <input
              type="color"
              className="w-full h-10 rounded"
              value={eyeColor}
              onChange={(e) => setEyeColor(e.target.value)}
            />
          </div>

          {/* Hair Color */}
          <div>
            <label className="font-semibold">Hair Color</label>
            <input
              type="color"
              className="w-full h-10 rounded"
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="pixelButton"
            onClick={() =>
              onSave({ skinTone, eyeColor, hairColor })
            }
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
