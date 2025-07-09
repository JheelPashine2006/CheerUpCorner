"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };


  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-200 p-8">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          CheerUP Corner
        </h1>
      </div>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-pink-500 text-center">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /* ...rest */ />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /* ...rest */ />
      <button type="submit">Login</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
        <div className="mt-4 text-center">
          <span className="text-gray-500">Don't have an account? </span>
          <Link href="/auth/signup" className="text-pink-500 underline hover:text-yellow-500">Sign Up</Link>
        </div>
        <Link href="/auth">
          <span className="block mt-6 text-sm text-pink-500 underline hover:text-yellow-500 text-center cursor-pointer">← Back</span>
        </Link>
      </div>
    </main>
  );
} 