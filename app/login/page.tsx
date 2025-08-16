// app/login/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/recognition");
        }
    }, [user, router]);

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-sm sm:max-w-md">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 sm:p-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                                {/* Clear Fire Icon */}
                                <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                                    <path d="M12 2c-1.5 4-4 6-7 7 0 0 2.5 2.5 7 2.5S19 9 19 9c-3-1-5.5-3-7-7z" />
                                    <path d="M12 17.5c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-1 2.5-2.5 2.5z" />
                                    <path d="M12 22c3.5 0 6-2.5 6-6 0-2-1-4-3-5.5 0 0 .5 1.5-1 3-1.5 1.5-2 1-2 1s.5-1.5-1-3c-1.5-1.5-1-3-1-3-2 1.5-3 3.5-3 5.5 0 3.5 2.5 6 6 6z" />
                                </svg>
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur-xl opacity-20 scale-110"></div>
                        </div>
                    </div>

                    {/* Header Text */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                            Welcome back
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            Sign in to find people who look like you
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-gray-700 font-medium text-sm sm:text-base transition-all duration-300 hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-300"
                        >
                            <div className="flex items-center justify-center space-x-3">
                                {/* Official Google Logo */}
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </div>

                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="bg-white px-4 text-gray-500 font-medium">New here?</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="text-sm sm:text-base font-medium text-red-500 hover:text-red-600 transition-colors duration-200"
                        >
                            Create an account with Google
                        </button>
                    </div>

                </div>


            </div>
        </div>
    );
}