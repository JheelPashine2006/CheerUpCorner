"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-purple-100 to-blue-200 relative overflow-hidden pt-32 pb-8">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-20 h-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
          CheerUP Corner
        </h1>
        <p className="text-center text-gray-600 mt-2 font-medium">Your Mood Companion</p>
      </div>

      {/* Main form container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/30 rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Us</h2>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Create a password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-indigo-600 font-semibold hover:text-purple-600 transition-colors duration-300 underline">
              Sign In
            </Link>
          </div>

          <Link href="/auth">
            <span className="block mt-6 text-sm text-gray-500 hover:text-indigo-600 text-center cursor-pointer transition-colors duration-300 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
} 