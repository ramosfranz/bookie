"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import '../styles/pixelButton.css';


// Dummy credentials
const DUMMY_EMAIL = "test@mail.com";
const DUMMY_PASSWORD = "123456";

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

    // ✅ Check against dummy credentials
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      alert("Login successful!");
      router.push("/dashboard"); // Replace with your main page
    } else {
      setErrorMsg("Invalid email or password");
    }

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
