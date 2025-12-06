"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import '../styles/pixelButton.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Helper function to create profile if it doesn't exist
  const createProfileIfNotExists = async (userId: string, username: string) => {
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // ignore "no rows found"
      console.error("Error checking profile:", fetchError);
      return;
    }

    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: userId, username }]);

      if (insertError) {
        console.error("Error creating profile:", insertError);
      } else {
        console.log("✅ Profile created successfully!");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 🔑 Supabase Auth login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Optional: check if email is confirmed
    if (!data.user?.email_confirmed_at) {
      setErrorMsg("Please verify your email before logging in.");
      setLoading(false);
      return;
    }

    // ✅ Get username from signup localStorage (or fallback to email)
    const signupUsername = localStorage.getItem("signupUsername") || data.user.email || "";

    // Create profile on first login
    await createProfileIfNotExists(data.user.id, signupUsername);

    // Clear the stored username after use
    localStorage.removeItem("signupUsername");

    alert("Login successful!");
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-6">
      <h1 className="text-4xl font-bold mb-6 text-purple-700">Log In</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
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
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
