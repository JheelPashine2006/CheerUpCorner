"use client";
import Link from "next/link";

export default function AuthLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-200 p-8">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          CheerUP Corner
        </h1>
      </div>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-pink-500">Welcome!</h1>
        <Link href="/auth/login" className="w-full mb-4">
          <button className="w-full py-3 bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200">Login</button>
        </Link>
        <Link href="/auth/signup" className="w-full">
          <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200">Sign Up</button>
        </Link>
        <Link href="/">
          <span className="block mt-6 text-sm text-pink-500 underline hover:text-yellow-500 text-center cursor-pointer">← Back to moods</span>
        </Link>
      </div>
    </main>
  );
} 