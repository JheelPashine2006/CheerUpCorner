// app/page.js
"use client";
import Link from "next/link";
import { useAuth } from "@/utils/AuthProvider";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

  const searchParams = useSearchParams();
  const [showVerifiedPopup, setShowVerifiedPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for verified parameter in URL
    const verified = searchParams.get("verified");
    console.log("Verified param:", verified); // Debug log
    
    if (verified === "1") {
      console.log("Setting popup to true"); // Debug log
      setShowVerifiedPopup(true);
      
      // Remove the query param from the URL after showing the popup
      const url = new URL(window.location.href);
      url.searchParams.delete("verified");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [searchParams]);

  // Also check on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");
    console.log("Initial verified param:", verified);
    
    if (verified === "1") {
      console.log("Setting popup to true on mount");
      setShowVerifiedPopup(true);
      
      // Remove the query param from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("verified");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white relative">
      {/* Verified Email Popup */}
      {showVerifiedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-transparent bg-clip-padding border-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 relative flex flex-col items-center animate-fade-in">
            <svg className="h-14 w-14 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">Email Verified!</h2>
            <p className="text-base text-gray-700 mb-4 text-center">Email verified successfully! Please <span className='font-semibold text-pink-600'>log in</span> to your account.</p>
            <button onClick={() => setShowVerifiedPopup(false)} className="px-6 py-3 bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg mt-2">Close</button>
          </div>
        </div>
      )}
      {/* Top-right corner buttons, absolutely positioned */}
      <div className="absolute top-6 right-6 flex gap-4 z-10">
        {!user && (
          <>
            <Link href="/auth/login">
              <button className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base">
                Login
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base">
                Sign Up
              </button>
            </Link>
          </>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-gray-700 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base"
          >
            Logout
          </button>
        )}
      </div>
      {/* Centered main content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          CheerUP Corner
        </h1>
        <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 text-center">
          Your cozy corner for mood-based smiles ✨
        </p>
        <h2 className="text-2xl sm:text-4xl mb-4 sm:mb-8 font-bold text-center">
          How are you feeling today?
        </h2>
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-6 max-w-[400px] sm:max-w-2xl lg:max-w-5xl mx-auto">
            {moods.map(({ mood, emoji, color }) => (
              <Link key={mood} href={`/suggestions/${mood}`}>
                <div
                  className={`w-full min-h-25 aspect-square sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition ${color}`}
                >
                  <span className="text-2xl sm:text-4xl lg:text-5xl">{emoji}</span>
                  <span className="mt-1 sm:mt-2 lg:mt-3 capitalize font-semibold text-sm sm:text-base lg:text-lg">{mood}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}