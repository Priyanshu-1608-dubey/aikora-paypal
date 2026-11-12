import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiBase } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${getApiBase()}/api/users`, { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) {
        const users = await res.json();
        const matched = Array.isArray(users)
          ? users.find((u: any) => u.email?.toLowerCase() === cleanEmail)
          : null;
        if (matched) {
          localStorage.setItem("aikora_user", JSON.stringify(matched));
          navigate("/dashboard");
          return;
        }
      }
    } catch {
      // Backend unreachable on mobile data — check local device storage
    }

    try {
      const localUsers = JSON.parse(localStorage.getItem("aikora_users") || "[]");
      const localMatch = Array.isArray(localUsers)
        ? localUsers.find((u: any) => u.email?.toLowerCase() === cleanEmail)
        : null;
      const userObj = localMatch || { name: cleanEmail.split("@")[0], email: cleanEmail };
      localStorage.setItem("aikora_user", JSON.stringify(userObj));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-neutral-200 p-8">
        <div className="text-2xl font-black tracking-tight mb-6">
          AIKORA<span className="text-[#9e2a2b]">.</span>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">Sign in to access your family circle.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9e2a2b]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9e2a2b]"
              required
            />
          </div>

          {error && <p className="text-xs text-[#9e2a2b] font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#9e2a2b] hover:bg-[#7d1f20] text-white font-bold text-sm transition-colors shadow-md"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-6">
          New to AIKORA?{" "}
          <Link to="/signup" className="text-[#9e2a2b] font-bold hover:underline">
            Create account
          </Link>{" "}
          •{" "}
          <Link to="/" className="text-neutral-700 font-semibold hover:underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
