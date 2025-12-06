"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import '../styles/pixelButton.css';
import '../styles/background.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Supabase Auth login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (!data.user?.email_confirmed_at) {
      setErrorMsg("Please verify your email before logging in.");
      setLoading(false);
      return;
    }

    // Insert profile if it doesn't exist (use email prefix as username)
    const defaultUsername = email.split("@")[0];
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!existingProfile) {
      await supabase
        .from("profiles")
        .insert([{ id: data.user.id, username: defaultUsername }]);
    }

    alert("Login successful!");
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bookieBackground p-6">
      <h1 className="text-4xl font-bold mb-2 text-purple-700">Log In</h1>

      {/* Sign up link below header */}
      <p className="mb-6 text-gray-700">
        I do not have an account.{" "}
        <span
          onClick={() => router.push("/signup")}
          className="text-purple-600 font-semibold cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>

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
