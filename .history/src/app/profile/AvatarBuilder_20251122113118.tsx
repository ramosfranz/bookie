"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface AvatarData {
  skinTone: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  hairstyle: number; // default 1
}

interface AvatarBuilderProps {
  onClose: () => void;
  onSave: (data: AvatarData) => void;
}

export default function AvatarBuilder({ onClose, onSave }: AvatarBuilderProps) {
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [eyeColor, setEyeColor] = useState<string | null>(null);
  const [hairColor, setHairColor] = useState<string | null>(null);
  const [hairstyle, setHairstyle] = useState<number>(1); // default selected

  // Skin options
  const skinOptions = [null, "#f1c27d", "#e0ac69", "#c68642", "#8d5524"];
  const skinBoxColors = ["#ffdbb4", "#d5b48b", "#a38d6a", "#5c4a3d", "#322c20"];
  const skinFilters = [
    "", // default
    "hue-rotate(10deg) saturate(142%) brightness(84%)",
    "hue-rotate(10deg) saturate(142%) brightness(65%)",
    "hue-rotate(10deg) saturate(142%) brightness(36%)",
    "hue-rotate(10deg) saturate(142%) brightness(20%)"
  ];

  // Eye options
    const eyeOptions = [null, "#000000", "#6b4f2c", "#1d6616", "#7fdf59"];
    const eyeBoxColors = ["#c41a1a", "#000000", "#1d6616", "#5734df", "#6b4c16"];
    const eyeFilters = [
        "", // default 
        "hue-rotate(0deg) saturate(0%) brightness(100%)",
         "hue-rotate(102deg) saturate(100%) brightness(100%)",
          "hue-rotate(-102deg) saturate(120%) brightness(100%)",
           "hue-rotate(60deg) saturate(100%) brightness(100%)" ];

  // Hair options
  const hairOptions = [null, "#c13037", "#6b4f2c", "#000000", "#ffffff"];
  const hairBoxColors = ["#ebba5e", "#44352b", "#9c6604", "#ff9eb4", "#ffffff"];
  const hairFilters = [
    "", // default
    "hue-rotate(-28deg) saturate(59%) brightness(30%)", // 2nd
    "hue-rotate(-11deg) saturate(200%) brightness(61%)", // 3rd
    "hue-rotate(-60deg) saturate(100%) brightness(102%)",  // 4th
    "hue-rotate(+100deg) saturate(0%) brightness(103%)" // 5th
  ];

  const hairStyles = [1, 2, 3, 4, 5]; // only 1 available

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[700px] relative flex gap-6">

        {/* Close button */}
        <button className="absolute right-3 top-3" onClick={onClose}><X /></button>

        {/* Left column — Avatar Preview */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-40 h-40 image-rendering-pixelated">
            <img
              src="/avatar/skin.png"
              className="absolute inset-0 w-full h-full"
              style={{ filter: skinTone === null ? "" : skinFilters[skinOptions.indexOf(skinTone)] }}
            />
            <img src="/avatar/fit.png" className="absolute inset-0 w-full h-full" />
            <img
              src="/avatar/eyes.png"
              className="absolute inset-0 w-full h-full"
              style={{ filter: eyeColor === null ? "" : eyeFilters[eyeOptions.indexOf(eyeColor)] }}
            />
            <img
              src="/avatar/hair.png"
              className="absolute inset-0 w-full h-full"
              style={{ filter: hairColor === null ? "" : hairFilters[hairOptions.indexOf(hairColor)] }}
            />
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
                  style={{ backgroundColor: skinBoxColors[idx] }}
                  onClick={() => setSkinTone(color)}
                  title={color ? color : "Original"}
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
                  style={{ backgroundColor: eyeBoxColors[idx] }}
                  onClick={() => setEyeColor(color)}
                  title={color ? color : "Original"}
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
                  style={{ backgroundColor: hairBoxColors[idx] }}
                  onClick={() => setHairColor(color)}
                  title={color ? color : "Original"}
                />
              ))}
            </div>
          </div>

          {/* Hairstyle — default 1 selected */}
          <div>
            <label className="font-semibold mb-1 block">Hairstyle</label>
            <div className="flex gap-2">
              {hairStyles.map((style) => (
                <div
                  key={style}
                  className={`w-8 h-8 rounded border-2 flex items-center justify-center
                    ${hairstyle === style ? "border-black" : "border-gray-300"}
                    ${style !== 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  onClick={() => style === 1 && setHairstyle(style)}
                  title={style === 1 ? "Default" : "Not available yet"}
                >
                  {style}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mt-4 gap-3">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button className="pixelButton" onClick={() => onSave({ skinTone, eyeColor, hairColor, hairstyle })}>Save Avatar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
