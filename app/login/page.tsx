// app/login/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Shield, Zap, Users } from "lucide-react";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md sm:max-w-lg">
                {/* Main Card */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-60"></div>
                        <div className="absolute top-16 right-12 w-12 h-12 bg-orange-200 rounded-lg rotate-45 opacity-40"></div>
                        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full opacity-80"></div>
                        <div className="absolute bottom-20 left-16 w-3 h-3 bg-orange-400 rounded-full"></div>
                        <div className="absolute top-8 left-8 w-2 h-2 bg-red-400 rounded-full"></div>
                    </div>

                    <div className="relative z-10 p-8 sm:p-10">
                        {/* Logo Section */}
                        <div className="flex justify-center mb-8 sm:mb-10">
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-transform duration-300 hover:scale-105">
                                    {/* Fire Icon */}
                                    <svg className="w-11 h-11 sm:w-14 sm:h-14 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                                        <path d="M12 2c-1.5 4-4 6-7 7 0 0 2.5 2.5 7 2.5S19 9 19 9c-3-1-5.5-3-7-7z" />
                                        <path d="M12 17.5c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-1 2.5-2.5 2.5z" />
                                        <path d="M12 22c3.5 0 6-2.5 6-6 0-2-1-4-3-5.5 0 0 .5 1.5-1 3-1.5 1.5-2 1-2 1s.5-1.5-1-3c-1.5-1.5-1-3-1-3-2 1.5-3 3.5-3 5.5 0 3.5 2.5 6 6 6z" />
                                    </svg>
                                </div>
                                {/* Animated glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur-xl opacity-30 scale-110 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Header Text */}
                        <div className="text-center mb-8 sm:mb-10">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Torch</span>
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm mx-auto">
                                Discover millions of dating profiles with powered image recognition search filters
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Instant Search</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Secure & Private</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Up to Date</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Millions of Profiles</span>
                            </div>
                        </div>

                        {/* Google Sign In Button */}
                        <div className="mb-6 sm:mb-8">
                            <button
                                onClick={handleGoogleLogin}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="group w-full relative overflow-hidden bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl px-6 py-4 sm:py-5 text-gray-700 font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:border-orange-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-400 shadow-lg"
                            >
                                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                                    {/* Official Google Logo */}
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
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
                                    <span className="transition-colors duration-300 group-hover:text-gray-900">
                                        Continue with Google
                                    </span>
                                </div>

                                {/* Enhanced hover effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10"></div>
                                </div>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-4">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs sm:text-sm font-medium text-gray-600">Trusted by 2K+ users</span>
                            </div>


                        </div>
                    </div>

                    {/* Bottom decorative element */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>
                </div>

                {/* Bottom stats */}
                {/* <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                        <div className="text-lg sm:text-xl font-bold text-orange-600">99%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                        <div className="text-lg sm:text-xl font-bold text-red-600">&lt;3s</div>
                        <div className="text-xs text-gray-600">Speed</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                        <div className="text-lg sm:text-xl font-bold text-orange-600">24/7</div>
                        <div className="text-xs text-gray-600">Available</div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}