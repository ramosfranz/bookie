"use client";

import { X } from "lucide-react";

interface AvatarData {
  // We can keep this for future extensions if you want editable colors
}

interface AvatarBuilderProps {
  onClose: () => void;
  onSave: () => void; // No data needed since the PNGs are fixed
}

export default function AvatarBuilder({
  onClose,
  onSave
}: AvatarBuilderProps) {

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
            />

            {/* Layer 2 — Outfit */}
            <img
              src="/avatar/fit.png"
              className="absolute inset-0 w-full h-full"
            />

            {/* Layer 3 — Eyes */}
            <img
              src="/avatar/eye.png"
              className="absolute inset-0 w-full h-full"
            />

            {/* Layer 4 — Hair */}
            <img
              src="/avatar/hair.png"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Only action buttons */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="pixelButton"
            onClick={onSave}
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
