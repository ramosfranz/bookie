"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ import Image component
import './styles/pixelButton.css';
import './styles/home.css';


export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bookieBackground">

      
      {/* Replace text with logo */}
      <div className="mb-6">
      <Image
      src="/image/bookieLogo1.png"
      alt="Bookie Logo"
      width={500}
      height={400}
      className="pixelated"
    />
      </div>

     <p
      className="text-lg text-center mb-12 max-w-md"
      style={{ color: "#f67129" }}
    >
      Books are pastries for the mind; flaky, layered, and best savored slowly.
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
