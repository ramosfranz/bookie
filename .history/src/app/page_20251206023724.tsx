"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ import Image component
import './styles/pixelButton.css';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 p-6">
      
      {/* Replace text with logo */}
      <div className="mb-6">
      <Image
      src="/image/bookieLogo.png"
      alt="Bookie Logo"
      width={400}
      height={400}
      priority
      className="pixelated"
    />
      </div>

      <p className="text-lg text-center text-gray-700 mb-12 max-w-md">
        Your online hub for research and leisure reading. Switch seamlessly between focused study and gamified reading fun.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => router.push("/login")}
          className="pixelButton"
        >
          Log In
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="pixelButton"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
