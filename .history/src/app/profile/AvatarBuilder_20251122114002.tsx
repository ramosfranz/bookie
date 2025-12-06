"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface AvatarData {
  skin: { boxColor: string; filter: string } | null;
  eyes: { boxColor: string; filter: string } | null;
  hair: { boxColor: string; filter: string } | null;
  hairstyle: number; // default 1
}

interface AvatarBuilderProps {
  onClose: () => void;
  onSave: (data: AvatarData) => void;
}

export default function AvatarBuilder({ onClose, onSave }: AvatarBuilderProps) {
  const [skin, setSkin] = useState<AvatarData["skin"]>(null);
  const [eyes, setEyes] = useState<AvatarData["eyes"]>(null);
  const [hair, setHair] = useState<AvatarData["hair"]>(null);
  const [hairstyle, setHairstyle] = useState<number>(1);

  // Skin options
  const skinOptions = [
    { boxColor: "#ffdbb4", filter: "" },
    { boxColor: "#d5b48b", filter: "hue-rotate(10deg) saturate(142%) brightness(84%)" },
    { boxColor: "#a38d6a", filter: "hue-rotate(10deg) saturate(142%) brightness(65%)" },
    { boxColor: "#5c4a3d", filter: "hue-rotate(10deg) saturate(142%) brightness(36%)" },
    { boxColor: "#322c20", filter: "hue-rotate(10deg) saturate(142%) brightness(20%)" }
  ];

  // Eye options
  const eyeOptions = [
    { boxColor: "#c41a1a", filter: "" },
    { boxColor: "#000000", filter: "hue-rotate(0deg) saturate(0%) brightness(100%)" },
    { boxColor: "#1d6616", filter: "hue-rotate(102deg) saturate(100%) brightness(100%)" },
    { boxColor: "#5734df", filter: "hue-rotate(-102deg) saturate(120%) brightness(100%)" },
    { boxColor: "#6b4c16", filter: "hue-rotate(60deg) saturate(100%) brightness(100%)" }
  ];

  // Hair options
  const hairOptions = [
    { boxColor: "#ebba5e", filter: "" },
    { boxColor: "#44352b", filter: "hue-rotate(-28deg) saturate(59%) brightness(30%)" },
    { boxColor: "#9c6604", filter: "hue-rotate(-11deg) saturate(200%) brightness(61%)" },
    { boxColor: "#ff9eb4", filter: "hue-rotate(0deg) saturate(-100%) brightness(52%)" },
    { boxColor: "#c1c1c1", filter: "hue-rotate(-44deg) saturate(29%) brightness(123%)" }
  ];

  const hairStyles = [1, 2, 3, 4, 5]; // only 1 available

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[700px] relative flex gap-6">
        <button className="absolute right-3 top-3" onClick={onClose}><X /></button>

        {/* Avatar Preview */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-40 h-40 image-rendering-pixelated">
            <img src="/avatar/skin.png" className="absolute inset-0 w-full h-full" style={{ filter: skin?.filter || "" }} />
            <img src="/avatar/fit.png" className="absolute inset-0 w-full h-full" />
            <img src="/avatar/eyes.png" className="absolute inset-0 w-full h-full" style={{ filter: eyes?.filter || "" }} />
            <img src="/avatar/hair.png" className="absolute inset-0 w-full h-full" style={{ filter: hair?.filter || "" }} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Skin */}
          <div>
            <label className="font-semibold mb-1 block">Skin Color</label>
            <div className="flex gap-2">
              {skinOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded cursor-pointer border-2 ${skin === opt ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: opt.boxColor }}
                  onClick={() => setSkin(opt)}
                  title="Skin color"
                />
              ))}
            </div>
          </div>

          {/* Eyes */}
          <div>
            <label className="font-semibold mb-1 block">Eye Color</label>
            <div className="flex gap-2">
              {eyeOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded cursor-pointer border-2 ${eyes === opt ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: opt.boxColor }}
                  onClick={() => setEyes(opt)}
                  title="Eye color"
                />
              ))}
            </div>
          </div>

          {/* Hair */}
          <div>
            <label className="font-semibold mb-1 block">Hair Color</label>
            <div className="flex gap-2">
              {hairOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded cursor-pointer border-2 ${hair === opt ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: opt.boxColor }}
                  onClick={() => setHair(opt)}
                  title="Hair color"
                />
              ))}
            </div>
          </div>

          {/* Hairstyle */}
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

          {/* Actions */}
          <div className="flex justify-end mt-4 gap-3">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button
              className="pixelButton"
              onClick={() => onSave({ skin, eyes, hair, hairstyle })}
            >Save Avatar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
