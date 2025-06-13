"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5328/api";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          className="border rounded px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </main>
  );
}
