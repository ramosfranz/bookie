"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/supabase/auth";
import '../styles/pixelButton.css';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); 
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

    // ✅ Remove the profiles insert to avoid RLS errors
    alert(
      "Signup successful! Please go to your email to confirm your account before logging in."
    );

    router.push("/login");
    setLoading(false);
  };

  // Optional: test Supabase connection
  const testConnection = async () => {
    console.log("Testing Supabase...");
    const { data, error } = await supabase.from("profiles").select("*").limit(1);

    if (error) {
      console.error("❌ Supabase connection failed:", error);
    } else {
      console.log("✅ Supabase connected! Sample data:", data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-6">
      <h1 className="text-4xl font-bold mb-6 text-purple-700">Create Account</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
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

        <button
          type="button"
          onClick={testConnection}
          className="mt-4 bg-gray-200 px-4 py-2 rounded"
        >
          Test Supabase Connection
        </button>
      </form>
    </div>
  );
}
