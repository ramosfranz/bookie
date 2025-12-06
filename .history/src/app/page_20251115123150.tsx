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
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition"
        >
          Log In
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow border border-purple-600 hover:bg-purple-50 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
