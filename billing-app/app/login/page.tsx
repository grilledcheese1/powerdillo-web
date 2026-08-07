"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    window.location.href = callbackUrl;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm space-y-5"
    >
      <div>
        <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-mono tracking-widest uppercase text-zinc-400 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/40 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm tracking-wide cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In →"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        <div className="flex justify-center mb-10">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Power<span className="text-orange-500">Dillo</span>
          </Link>
        </div>

        <h1
          className="text-4xl font-bold text-center mb-2 leading-tight"
          style={{ fontFamily: "'Poppins','Arial',sans-serif", letterSpacing: "-0.02em" }}
        >
          Welcome Back
        </h1>
        <p className="text-center text-zinc-500 text-sm mb-10">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-500 hover:underline">
            Sign up
          </Link>
        </p>

        <Suspense fallback={<div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 h-64 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
