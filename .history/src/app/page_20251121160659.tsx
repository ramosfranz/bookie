"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 p-6">
      <h1 className="text-5xl font-bold mb-6 text-center text-purple-800">
        Welcome to Bookie!
      </h1>

      <p className="text-lg text-center text-gray-700 mb-12 max-w-md">
        Your online hub for research and leisure reading. Switch seamlessly between focused study and gamified reading fun.
      </p>

      <div className="flex gap-6">
  <button
    onClick={() => router.push("/login")}
    className="px-6 py-3 border-2 border-purple-800 bg-purple-600 text-white font-mono text-sm shadow-[4px_4px_0_#000] hover:bg-gradient-to-b hover:from-purple-400 hover:to-purple-600 active:translate-y-[4px] active:shadow-none"
  >
    Log In
  </button>

  <button
    onClick={() => router.push("/signup")}
    className="px-6 py-3 border-2 border-purple-800 bg-purple-600 text-white font-mono text-sm shadow-[4px_4px_0_#000] hover:bg-gradient-to-b hover:from-purple-400 hover:to-purple-600 active:translate-y-[4px] active:shadow-none"
  >
    Create Account
  </button>
</div>


    </div>
  );
}
