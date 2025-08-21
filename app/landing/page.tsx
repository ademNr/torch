"use client"
import React, { useState, useEffect } from 'react';
import { Search, Shield, Clock, Users, ArrowRight, Eye, Heart, CheckCircle, Sparkles, Zap, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';



const useAuth = () => ({
    user: null,
    loading: false
});

// Custom FireIcon component
const FireIcon = ({ size = 24, className = "", color = "currentColor" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            stroke={color}
            strokeWidth="0.5"
            className={`drop-shadow-lg ${className}`}
        >
            <path d="M12 2c-1.5 4-4 6-7 7 0 0 2.5 2.5 7 2.5S19 9 19 9c-3-1-5.5-3-7-7z" />
            <path d="M12 17.5c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-1 2.5-2.5 2.5z" />
            <path d="M12 22c3.5 0 6-2.5 6-6 0-2-1-4-3-5.5 0 0 .5 1.5-1 3-1.5 1.5-2 1-2 1s.5-1.5-1-3c-1.5-1.5-1-3-1-3-2 1.5-3 3.5-3 5.5 0 3.5 2.5 6 6 6z" />
        </svg>
    );
};

const TorchLandingPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Show results demo after 3 seconds on mobile, 2 seconds on desktop
        const isMobile = window.innerWidth < 768;
        const resultsTimeout = setTimeout(() => {
            setShowResults(true);
        }, isMobile ? 3000 : 2000);

        return () => {
            clearTimeout(resultsTimeout);
        };
    }, []);

    const handleGetStarted = () => {
        if (loading) return;

        if (user) {
            router.push('/');
        } else {
            router.push('/login');
        }
    };

    const features = [
        {
            icon: <Search className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
            title: "Advanced Image Recognition",
            description: "Torch scans through millions of dating profiles with a high accuracy"
        },
        {
            icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
            title: "100% Anonymous & Secure",
            description: "Your searches are completely private. We don't store your personal information"
        },
        {
            icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
            title: "Instant Results",
            description: "Get results in under 1 second. No waiting around - find out immediately"
        },
        {
            icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
            title: "Multiple Platform Coverage",
            description: "We scan across all major dating apps including Tinder, Bumble and more"
        }
    ];

    const stats = [
        { number: "2.1M+", label: "Profiles" },
        { number: "98.5%", label: "Accuracy Rate" },
        { number: "2K+", label: "Users" },
        { number: "1s", label: "Average Search Time" }
    ];

    const howItWorks = [
        {
            step: 1,
            title: "Upload Photo",
            description: "Simply upload a clear photo of the person you want to search for",
            icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        },
        {
            step: 2,
            title: "AI Analysis",
            description: "Torch scans millions of dating profiles in seconds",
            icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        },
        {
            step: 3,
            title: "Get Results",
            description: "View results with confidence scores",
            icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 lg:-top-40 lg:-right-40 w-32 h-32 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 lg:-bottom-40 lg:-left-40 w-32 h-32 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-16 lg:pb-24 sm:px-6 lg:px-8">
                    {/* Navigation */}
                    <nav className="flex items-center justify-between mb-8 sm:mb-12 lg:mb-16">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                                <FireIcon size={16} color="white" className="sm:hidden" />
                                <FireIcon size={20} color="white" className="hidden sm:block lg:hidden" />
                                <FireIcon size={28} color="white" className="hidden lg:block" />
                            </div>
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                Torch
                            </span>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-white shadow-lg"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                            )}
                        </button>

                        {/* Desktop CTA Button */}
                        <button
                            onClick={handleGetStarted}
                            className="hidden lg:flex items-center px-4 py-2 xl:px-6 xl:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl xl:rounded-2xl font-semibold text-sm xl:text-base hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                        >
                            {user ? 'Search Now' : 'Get Started'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </nav>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden absolute top-16 sm:top-20 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-4">
                            <button
                                onClick={handleGetStarted}
                                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold"
                            >
                                {user ? 'Search Now' : 'Get Started'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    )}

                    {/* Hero Content */}
                    <div className="space-y-8 sm:space-y-12 lg:space-y-16 xl:space-y-20">
                        {/* Text Content */}
                        <div className={`text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 ${isVisible ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'}`}>
                            <div className="space-y-4 sm:space-y-6">
                                <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl sm:rounded-2xl border border-red-100">
                                    <FireIcon size={12} color="#ef4444" className="mr-2 sm:hidden" />
                                    <FireIcon size={14} color="#ef4444" className="mr-2 hidden sm:block" />
                                    <span className="text-xs sm:text-sm font-semibold text-red-700">#1 Profile Detection Tool</span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                                    Discover if someone is
                                    <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                        using dating apps
                                    </span>
                                </h1>

                                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed max-w-2xl lg:max-w-3xl mx-auto lg:mx-0">
                                    Upload a photo and find out if that person has profiles on Tinder, Bumble and other dating platforms.
                                    <span className="font-semibold text-red-600"> Anonymous and instant.</span>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={handleGetStarted}
                                    className="group flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                                >
                                    <FireIcon size={16} color="white" className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform sm:hidden" />
                                    <FireIcon size={20} color="white" className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform hidden sm:block" />
                                    {user ? 'Start Searching' : 'Try Torch Now'}
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Enhanced Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8 lg:pt-12 max-w-4xl mx-auto">
                                {stats.map((stat, index) => (
                                    <div key={index} className="group relative">
                                        <div className="bg-white/70 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-center shadow-sm hover:shadow-md border border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                                            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                                            <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile-First Screenshots Demo */}
                        <div className={`relative ${isVisible ? 'animate-in fade-in slide-in-from-bottom duration-1000 delay-500' : 'opacity-0'}`}>
                            {/* Mobile Layout (default) */}
                            <div className="block lg:hidden space-y-6 sm:space-y-8">
                                {/* Step 1: Upload Interface - Mobile */}
                                <div className="relative">
                                    <div className="max-w-xs sm:max-w-sm mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <FireIcon size={12} color="white" className="sm:hidden" />
                                                <FireIcon size={14} color="white" className="hidden sm:block" />
                                                <span className="text-white font-bold text-xs sm:text-sm">Torch</span>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-6 bg-gray-50">
                                            <div className="text-center mb-4 sm:mb-6">
                                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">Let&apos;s find out on Torch</h3>
                                                <p className="text-gray-600 text-xs sm:text-sm">Upload a photo to find out if He/She is using a dating app !!</p>
                                            </div>

                                            {/* Upload area */}
                                            <div className="border-2 border-dashed border-red-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center bg-white mb-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Upload Your Photo</h4>
                                                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Drag & drop a photo here or click the button below</p>
                                                <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-6 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center mx-auto">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Select Photo
                                                </button>
                                                <p className="text-xs text-gray-500 mt-2">JPG, PNG, WEBP formats accepted</p>
                                            </div>

                                            {/* Buttons */}
                                            <div className="space-y-2 sm:space-y-3">
                                                <button className="w-full py-2 sm:py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium text-xs sm:text-sm">
                                                    Reset
                                                </button>
                                                <button className="w-full py-2 sm:py-3 px-4 bg-gray-300 text-gray-500 rounded-xl font-medium text-xs sm:text-sm cursor-not-allowed flex items-center justify-center">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Find Matches
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 1 Label */}
                                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg border-2 border-red-200">
                                            <span className="text-red-600 font-semibold text-xs sm:text-sm">Step 1: Upload</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Arrow */}
                                <div className="flex justify-center py-2 sm:py-4">
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-red-400 to-orange-400"></div>
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse rotate-90" />
                                        <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-red-400 to-orange-400"></div>
                                    </div>
                                </div>

                                {/* Step 2: Results Interface - Mobile */}
                                {showResults && (
                                    <div className="animate-in fade-in slide-in-from-bottom duration-1000">
                                        <div className="relative">
                                            <div className="max-w-xs sm:max-w-sm mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                                {/* Header */}
                                                <div className="bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <FireIcon size={12} color="white" className="sm:hidden" />
                                                        <FireIcon size={14} color="white" className="hidden sm:block" />
                                                        <span className="text-white font-bold text-xs sm:text-sm">Torch</span>
                                                    </div>
                                                </div>

                                                {/* Results content */}
                                                <div className="p-4 sm:p-6 bg-gray-50">
                                                    {/* User image section */}
                                                    <div className="text-center mb-4 sm:mb-6">
                                                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4">
                                                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl sm:rounded-2xl overflow-hidden relative">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/40 to-gray-700/40 blur-md"></div>
                                                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-2 py-1 shadow-lg border border-gray-200">
                                                                    <span className="text-xs font-semibold text-gray-700">?</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Recognition Results</h3>
                                                        <p className="text-gray-600 text-xs sm:text-sm">Analysis completed successfully</p>
                                                    </div>

                                                    {/* Matches section */}
                                                    <div>
                                                        <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Your Matches (1)</h4>
                                                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Sorted by similarity score</p>

                                                        {/* Match card */}
                                                        <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                                                            <div className="relative h-28 sm:h-32 lg:h-48 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/50 to-gray-700/50 blur-lg"></div>
                                                                <div className="absolute inset-0 bg-black/20"></div>

                                                                {/* Match percentage badge */}
                                                                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 bg-red-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold">
                                                                    92.7% Match
                                                                </div>

                                                                {/* Blurred name at bottom */}
                                                                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 lg:bottom-4 lg:left-4">
                                                                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2">
                                                                        <div className="text-white font-bold text-xs sm:text-sm blur-sm">
                                                                            ████ ███ ███████
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Step 2 Label */}
                                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                                <div className="bg-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg border-2 border-red-200">
                                                    <span className="text-red-600 font-semibold text-xs sm:text-sm">Step 2: Results</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Layout (lg and up) */}
                            <div className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 2xl:space-x-12 overflow-x-auto pb-8">
                                {/* Step 1: Upload Interface - Desktop */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-72 xl:w-80 2xl:w-96 h-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                                        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <FireIcon size={16} color="white" />
                                                <span className="text-white font-bold text-sm">Torch</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-white text-sm">
                                                <FireIcon size={12} color="white" />
                                                <span>3</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-50">
                                            <div className="text-center mb-6">
                                                <h3 className="text-lg xl:text-xl font-bold text-gray-900 mb-2">Let&apos;s find out on Torch</h3>
                                                <p className="text-gray-600 text-sm">Upload a photo to find out if He/She is using a dating app !!</p>
                                            </div>

                                            <div className="border-2 border-dashed border-red-300 rounded-2xl p-6 xl:p-8 text-center bg-white mb-4">
                                                <div className="w-14 h-14 xl:w-16 xl:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-red-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 xl:w-6 xl:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-2">Upload Your Photo</h4>
                                                <p className="text-gray-600 text-sm mb-4">Drag & drop a photo here or click the button below</p>
                                                <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 xl:px-6 rounded-xl font-medium text-sm flex items-center justify-center mx-auto">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Select Photo
                                                </button>
                                                <p className="text-xs text-gray-500 mt-2">JPG, PNG, WEBP formats accepted</p>
                                            </div>

                                            <div className="space-y-3">
                                                <button className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium text-sm">
                                                    Reset
                                                </button>
                                                <button className="w-full py-3 px-4 bg-gray-300 text-gray-500 rounded-xl font-medium text-sm cursor-not-allowed flex items-center justify-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Find Matches
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-white rounded-full px-4 py-2 shadow-lg border-2 border-red-200">
                                            <span className="text-red-600 font-semibold text-sm">Step 1: Upload</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center flex-shrink-0">
                                    <div className="w-8 xl:w-12 h-0.5 bg-gradient-to-r from-red-400 to-orange-400"></div>
                                    <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6 text-red-500 animate-pulse" />
                                    <div className="w-8 xl:w-12 h-0.5 bg-gradient-to-r from-red-400 to-orange-400"></div>
                                </div>

                                {/* Step 2: Results Interface - Desktop */}
                                {showResults && (
                                    <div className="flex-shrink-0 animate-in fade-in slide-in-from-right duration-1000">
                                        <div className="relative">
                                            <div className="w-72 xl:w-80 2xl:w-96 h-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                                <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <FireIcon size={16} color="white" />
                                                        <span className="text-white font-bold text-sm">Torch</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-white text-sm">
                                                        <FireIcon size={12} color="white" />
                                                        <span>2</span>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-gray-50">
                                                    <div className="text-center mb-6">
                                                        <div className="relative w-16 h-16 xl:w-20 xl:h-20 mx-auto mb-4">
                                                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl overflow-hidden relative">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/40 to-gray-700/40 blur-md"></div>
                                                                <div className="absolute top-1 right-1 w-5 h-5 xl:w-6 xl:h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-3 h-3 xl:w-4 xl:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-2 py-1 shadow-lg border border-gray-200">
                                                                    <span className="text-xs font-semibold text-gray-700">?</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-lg xl:text-xl font-bold text-gray-900 mb-2">Recognition Results</h3>
                                                        <p className="text-gray-600 text-sm">Analysis completed successfully</p>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-lg xl:text-xl font-bold text-gray-900 mb-4">Your Matches (1)</h4>
                                                        <p className="text-gray-600 text-sm mb-4">Sorted by similarity score</p>

                                                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                                                            <div className="relative h-40 xl:h-48 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/50 to-gray-700/50 blur-lg"></div>
                                                                <div className="absolute inset-0 bg-black/20"></div>

                                                                <div className="absolute top-3 right-3 xl:top-4 xl:right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                                    92.7% Match
                                                                </div>

                                                                <div className="absolute bottom-3 left-3 xl:bottom-4 xl:left-4">
                                                                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
                                                                        <div className="text-white font-bold text-sm blur-sm">
                                                                            ████ ███ ███████
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                                                <div className="bg-white rounded-full px-4 py-2 shadow-lg border-2 border-red-200">
                                                    <span className="text-red-600 font-semibold text-sm">Step 2: Results</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            How <span className="text-red-500">Torch</span> Works
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                            Get results in 3 simple steps.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="relative text-center group">
                                <div className="relative mb-4 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <div className="text-white">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 font-bold text-xs sm:text-sm shadow-md">
                                        {item.step}
                                    </div>
                                </div>

                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm sm:text-base px-2 sm:px-4">{item.description}</p>

                                {index < howItWorks.length - 1 && (
                                    <div className="hidden lg:block absolute top-7 sm:top-8 lg:top-9 xl:top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-red-200 to-orange-200 transform translate-x-6"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Why Choose <span className="text-red-500">Torch</span>?
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                            The most advanced and secure profile detection technology available.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 group hover:-translate-y-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 group-hover:from-red-500 group-hover:to-orange-500 transition-all duration-300">
                                    <div className="text-red-500 group-hover:text-white transition-colors">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-r from-red-500 to-orange-500">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 sm:mb-8 lg:mb-10">
                        <FireIcon size={48} color="white" className="sm:hidden mx-auto mb-4 animate-pulse" />
                        <FireIcon size={60} color="white" className="hidden sm:block lg:hidden mx-auto mb-6 animate-pulse" />
                        <FireIcon size={80} color="white" className="hidden lg:block mx-auto mb-8 animate-pulse" />
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
                            Ready to Discover the Truth?
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-red-100 max-w-2xl mx-auto px-4 sm:px-0">
                            Join over 2,000 users who&apos;ve uncovered the truth about their dating lives.
                            Start your search now - it only takes 30 seconds.
                        </p>
                    </div>

                    <button
                        onClick={handleGetStarted}
                        className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 bg-white text-red-600 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                    >
                        <FireIcon size={16} color="#dc2626" className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform sm:hidden" />
                        <FireIcon size={20} color="#dc2626" className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform hidden sm:block" />
                        {user ? 'Start Searching Now' : 'Get Started Free'}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="mt-3 sm:mt-4 text-red-100 text-xs sm:text-sm">
                        No credit card required • Instant Results
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <FireIcon size={16} color="white" className="sm:hidden" />
                                <FireIcon size={18} color="white" className="hidden sm:block lg:hidden" />
                                <FireIcon size={24} color="white" className="hidden lg:block" />
                            </div>
                            <span className="text-base sm:text-lg lg:text-xl font-bold">Torch</span>
                        </div>

                        <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
                            <p>&copy; 2025 Torch. All rights reserved.</p>
                            <p className="mt-1">Discover the truth, anonymously and securely.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TorchLandingPage;