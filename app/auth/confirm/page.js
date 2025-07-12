"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      const supabase = createClientComponentClient();
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      if (!token || type !== "signup") {
        setStatus("error");
        setMessage("Invalid or missing confirmation link.");
        setShowModal(true);
        return;
      }
      const { error } = await supabase.auth.verifyOtp({
        token,
        type: "signup",
      });
      if (error) {
        setStatus("error");
        setMessage(error.message || "Email confirmation failed.");
        setShowModal(true);
      } else {
        setStatus("success");
        setMessage("Your email has been verified! You can now log in to your account.");
        setShowModal(true);
        console.log("Email verified successfully, showing immediate popup...");
        
        // Set localStorage as backup for mobile devices
        localStorage.setItem("emailVerified", "true");
        
        // Show popup immediately and redirect after user closes it
        setTimeout(() => {
          console.log("Redirecting to /?verified=1");
          // Use window.location for better mobile compatibility
          window.location.href = "/?verified=1";
        }, 5000); // Give user more time to read the message
      }
    };
    confirmEmail();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-purple-200 relative">
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-transparent bg-clip-padding border-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 relative flex flex-col items-center animate-fade-in">
            {status === "loading" && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400 mb-4"></div>
                <p className="text-lg font-semibold text-pink-600">Confirming your email...</p>
              </>
            )}
            {status === "success" && (
              <>
                <svg className="h-14 w-14 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">🎉 Email Verified Successfully!</h2>
                <p className="text-base text-gray-700 mb-4 text-center">{message}</p>
                <p className="text-base text-gray-700 mb-6 text-center">Please <span className="font-semibold text-pink-600">log in</span> to continue to your account.</p>
                <div className="flex gap-3">
                  <Link href="/auth/login">
                    <button className="px-6 py-3 bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg">Go to Login</button>
                  </Link>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setTimeout(() => {
                        // Use window.location for better mobile compatibility
                        window.location.href = "/?verified=1";
                      }, 500);
                    }}
                    className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                  >
                    Go to Home
                  </button>
                </div>
              </>
            )}
            {status === "error" && (
              <>
                <svg className="h-14 w-14 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <h2 className="text-2xl font-bold text-red-700 mb-2 text-center">Confirmation Failed</h2>
                <p className="text-base text-gray-700 mb-4 text-center">{message}</p>
                <Link href="/auth/signup">
                  <button className="px-6 py-3 bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-lg">Try Signing Up Again</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      {/* Decorative background remains visible */}
    </div>
  );
} 