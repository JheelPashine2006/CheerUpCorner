// app/page.js
"use client";
import Link from "next/link";
import { useAuth } from "@/utils/AuthProvider";

export default function Home() {
  const { user, supabase } = useAuth();
  const moods = [
    { mood: "happy", emoji: "😊", color: "bg-yellow-400" },
    { mood: "sad", emoji: "😢", color: "bg-blue-500" },
    { mood: "romantic", emoji: "😍", color: "bg-pink-500" },
    { mood: "angry", emoji: "😤", color: "bg-red-600" },
    { mood: "calm", emoji: "😌", color: "bg-green-500" },
    { mood: "excited", emoji: "🤩", color: "bg-purple-500" },
  ];
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 relative">
      <div className="absolute top-6 right-6 flex gap-4 z-10">
        {!user && (
          <>
            <Link href="/auth/login">
              <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200">
                Login
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200">
                Sign Up
              </button>
            </Link>
          </>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200"
          >
            Logout
          </button>
        )}
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
        CheerUP Corner
      </h1>
      <p className="text-lg text-gray-300 mb-6 text-center">
        Your cozy corner for mood-based smiles ✨
      </p>
      <h2 className="text-4xl mb-8 font-bold text-center">
        How are you feeling today?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {moods.map(({ mood, emoji, color }) => (
          <Link key={mood} href={`/suggestions/${mood}`}>
            <div
              className={`w-32 h-32 flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition ${color}`}
            >
              <span className="text-4xl">{emoji}</span>
              <span className="mt-2 capitalize font-semibold">{mood}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
