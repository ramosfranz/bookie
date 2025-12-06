"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/supabase/auth";
import '../styles/pixelButton.css';
import '../styles/background.css';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Create user in Supabase
    const { data: authData, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setErrorMsg(signUpError.message);
      setLoading(false);
      return;
    }

    alert(
      "Signup successful! Please check your email to confirm your account before logging in."
    );

    router.push("/login");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bookieBackground0 p-6">
      <h1 className="text-4xl font-bold mb-2 text-purple-700">Create Account</h1>

      {/* Log in link below header */}
      <p className="mb-6 text-gray-700">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-purple-600 font-semibold cursor-pointer hover:underline"
        >
          Log in
        </span>
      </p>

      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        {errorMsg && <p className="text-red-600">{errorMsg}</p>}
        <button
          type="submit"
          className="pixelButton"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
