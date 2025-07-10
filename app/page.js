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
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8 relative">
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex gap-2 sm:gap-4 z-10">
        {!user && (
          <>
            <Link href="/auth/login">
              <button className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base">
                Login
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base">
                Sign Up
              </button>
            </Link>
          </>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-gray-700 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base"
          >
            Logout
          </button>
        )}
      </div>
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
        CheerUP Corner
      </h1>
      <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 text-center">
        Your cozy corner for mood-based smiles ✨
      </p>
      <h2 className="text-2xl sm:text-4xl mb-4 sm:mb-8 font-bold text-center">
        How are you feeling today?
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 w-full max-w-xs sm:max-w-2xl mx-auto">
        {moods.map(({ mood, emoji, color }) => (
          <Link key={mood} href={`/suggestions/${mood}`}>
            <div
              className={`w-full h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition ${color}`}
            >
              <span className="text-2xl sm:text-4xl">{emoji}</span>
              <span className="mt-1 sm:mt-2 capitalize font-semibold text-sm sm:text-base">{mood}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
