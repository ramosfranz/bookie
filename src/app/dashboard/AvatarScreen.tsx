"use client";

import { useRef, useEffect } from "react";

export default function AvatarScreen() {
  return (
    <div className="w-full bg-white rounded-xl shadow flex items-center justify-center mb-6 h-48 overflow-hidden">
      <EnvironmentCanvas />
    </div>
  );
}

function EnvironmentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TILE_SIZE = 24;
  const INTERNAL_WIDTH = 300;   // drawing resolution (does NOT affect UI size)
  const INTERNAL_HEIGHT = 200;

  const imagesRef = useRef<{
    floor: HTMLImageElement;
    back: HTMLImageElement;
  } | null>(null);

  // Load images
  useEffect(() => {
    const floor = new Image();
    floor.src = "/screen/tile.png";

    const back = new Image();
    back.src = "/screen/back.png";

    imagesRef.current = { floor, back };

    const handleLoad = () => draw();
    floor.onload = handleLoad;
    back.onload = handleLoad;
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !imagesRef.current) return;

    const { floor, back } = imagesRef.current;

    ctx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

    // Draw tiled floor
    for (let y = 0; y < INTERNAL_HEIGHT; y += TILE_SIZE) {
      for (let x = 0; x < INTERNAL_WIDTH; x += TILE_SIZE) {
        ctx.drawImage(floor, x, y, TILE_SIZE, TILE_SIZE);
      }
    }

    // Draw overlay (back.png)
    ctx.drawImage(back, 0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
  };

  return (
    <canvas
      ref={canvasRef}
      width={INTERNAL_WIDTH}
      height={INTERNAL_HEIGHT}
      className="
        w-full
        h-full
        image-rendering-pixelated
        object-cover
      "
    />
  );
}
