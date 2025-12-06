"use client";

import { useEffect, useRef } from "react";

interface EnvironmentCanvasProps {
  width?: number;
  height?: number;
}

export default function EnvironmentCanvas({
  width = 300,
  height = 200,
}: EnvironmentCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TILE_SIZE = 24;

  // Preloaded images
  const imagesRef = useRef<{
    floor: HTMLImageElement;
    back: HTMLImageElement;
  } | null>(null);

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
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imagesRef.current) return;

    const { floor, back } = imagesRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1️⃣ Floor tiles
    for (let y = 0; y < height; y += TILE_SIZE) {
      for (let x = 0; x < width; x += TILE_SIZE) {
        ctx.drawImage(floor, x, y, TILE_SIZE, TILE_SIZE);
      }
    }

    // 2️⃣ Back image overlay
    ctx.drawImage(back, 0, 0, width, height);
  };

  return (
    <div className="w-full flex justify-center mb-6">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl shadow image-rendering-pixelated"
      />
    </div>
  );
}
