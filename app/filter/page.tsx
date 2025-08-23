"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, User, ArrowRight, Settings, Facebook, Instagram, X, RefreshCw, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";
import RechargeModal from "@/components/Modal";

interface FilterSearchResponse {
    matches: Array<{
        profileId: string;
        name: string;
        age: number;
        distance: number;
        scrapedAt: string;
        tinderId: string;
        matchedImageId: string;
        matchedImageUrl: string;
        imageUrls: string[];
        similarity: number;
        confidenceLevel: string;
    }>;
}

export default function FilterSearchPage() {
    const { user, refreshUser, logout } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [rechargeError, setRechargeError] = useState<string | null>(null);
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showSystemBusyModal, setShowSystemBusyModal] = useState(false);
    const [systemBusyMessage, setSystemBusyMessage] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        name: "",
        minAge: "",
        maxAge: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const retrySearch = (e: React.FormEvent) => {
        closeSystemBusyModal();
        handleSubmit(e);
    };
    const handleSubmit = async (e: React.FormEvent) => {


        setRechargeError(null);
        setSystemBusyMessage(null);
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Validate inputs - all fields are now required
            if (!filters.name || !filters.minAge || !filters.maxAge) {
                setError("All fields are required");
                setIsLoading(false);
                return;
            }

            if (parseInt(filters.minAge) > parseInt(filters.maxAge)) {
                setError("Minimum age cannot be greater than maximum age");
                setIsLoading(false);
                return;
            }

            // Call the API
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/profile-search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user!.token}`
                },
                body: JSON.stringify({
                    name: filters.name,
                    minAge: parseInt(filters.minAge),
                    maxAge: parseInt(filters.maxAge)
                })
            });
            if (response.status === 401) {
                logout();
                router.push('/');
                return;
            }

            if (response.status === 403) {
                const errorData = await response.json();
                setRechargeError(errorData.message);
                setShowRechargeModal(true);
                refreshUser();
                return;
            }


            const data: FilterSearchResponse = await response.json();

            // Transform the data to match the format expected by the dashboard
            const transformedMatches = data.matches.map(match => ({
                id: match.profileId,
                name: match.name,
                age: String(match.age),
                distance: String(match.distance),
                imageUrls: match.imageUrls,
                bio: `${match.confidenceLevel} confidence match`,
                interests: [`${match.similarity * 100}% Match`],
                similarity: match.similarity,
                confidence: match.confidenceLevel
            }));

            // Store results in sessionStorage for the dashboard
            sessionStorage.setItem('faceRecognitionResults', JSON.stringify({
                matches: transformedMatches,
                searchStats: {
                    matchesFound: data.matches.length,
                    totalCandidates: 0,
                    processingTime: 0,
                    similarityThreshold: 0.8
                },
                originalImage: null,
                searchType: 'filter'
            }));
            refreshUser();
            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err) {
            console.error("Search error:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };
    const closeRechargeModal = () => {
        refreshUser();
        setShowRechargeModal(false);
        setRechargeError(null);
    };

    const closeSystemBusyModal = () => {
        setShowSystemBusyModal(false);
        setSystemBusyMessage(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <AppHeader
                title="Torch"
                subtitle="Find profiles by name and age"
            />
            {/* Enhanced System Busy Modal */}
            {showSystemBusyModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                        {/* Background decorative elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-60 animate-pulse"></div>
                            <div className="absolute top-16 right-12 w-12 h-12 bg-orange-200 rounded-lg rotate-45 opacity-40 animate-bounce"></div>
                            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full opacity-80 animate-pulse"></div>
                            <div className="absolute bottom-20 left-16 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
                            <div className="absolute top-8 left-8 w-2 h-2 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        </div>

                        <div className="relative z-10 p-6 sm:p-8">
                            {/* Enhanced Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    {/* Icon with glow effect */}
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl transform transition-transform duration-300 hover:scale-105">
                                            <Clock className="w-7 h-7 text-white animate-pulse drop-shadow-lg" />
                                        </div>
                                        {/* Animated glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl blur-xl opacity-30 scale-110 animate-pulse"></div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-1">
                                            Processing Database
                                        </h2>
                                        <p className="text-sm text-gray-500 font-medium">AI Recognition System</p>
                                    </div>
                                </div>

                                <button
                                    onClick={closeSystemBusyModal}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group hover:scale-110"
                                >
                                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </button>
                            </div>

                            <div className="mb-8">
                                {/* Enhanced Main Status Card */}
                                <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 rounded-xl p-5 mb-6 border border-orange-200 relative overflow-hidden shadow-sm">
                                    {/* Animated shimmer effect */}
                                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-start mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4 animate-pulse shadow-lg">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-bold text-lg mb-2">
                                                    Recognition system is initializing
                                                </p>
                                                {/* Enhanced progress bar */}
                                                <div className="w-full bg-white/70 rounded-full h-3 overflow-hidden shadow-inner">
                                                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full relative animate-pulse">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/50 rounded-lg p-3 mb-4 border border-white/60">
                                            <p className="text-gray-700 mb-2 font-medium leading-relaxed">
                                                {systemBusyMessage}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-gray-600 font-medium">System Status: Active</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
                                                <Clock className="w-3 h-3 text-orange-600" />
                                                <span className="text-xs text-orange-700 font-bold">1-5 minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Process Details */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative hover:shadow-sm transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">What&apos;s happening:</h3>
                                    </div>

                                    <ul className="space-y-4">
                                        <li className="flex items-center group hover:bg-white/50 rounded-lg p-2 transition-all duration-200">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4 animate-pulse shadow-md">
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                                                Our system is processing facial recognition data
                                            </span>
                                        </li>
                                        <li className="flex items-center group hover:bg-white/50 rounded-lg p-2 transition-all duration-200">
                                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-4 animate-pulse shadow-md" style={{ animationDelay: '0.2s' }}>
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                                                New profiles are being added to the database
                                            </span>
                                        </li>
                                        <li className="flex items-center group hover:bg-white/50 rounded-lg p-2 transition-all duration-200">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4 animate-pulse shadow-md" style={{ animationDelay: '0.4s' }}>
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                                                Recognition models are being optimized
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Trust Indicator */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 shadow-sm">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-green-700">Trusted by 2K+ users</span>
                                </div>
                            </div>

                            {/* Enhanced Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={closeSystemBusyModal}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 hover:shadow-md"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={retrySearch}
                                    className="flex-1 relative overflow-hidden group bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                >
                                    <div className="flex items-center justify-center px-4 py-3 relative z-10">
                                        <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                                        Try Again
                                    </div>

                                    {/* Button shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                                </button>
                            </div>
                        </div>

                        {/* Bottom decorative gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-pulse"></div>

                        {/* Animated shimmer overlay for entire modal */}
                        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-shimmer-slow"></div>
                    </div>

                    {/* Enhanced Custom Animations */}
                    <style jsx>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%) skewX(-12deg); }
                100% { transform: translateX(200%) skewX(-12deg); }
            }
            @keyframes shimmer-slow {
                0% { transform: translateX(-100%) skewX(-12deg); }
                100% { transform: translateX(300%) skewX(-12deg); }
            }
            @keyframes fade-in {
                from { opacity: 0; transform: scale(0.9) translateY(20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-shimmer {
                animation: shimmer 2s infinite;
            }
            .animate-shimmer-slow {
                animation: shimmer-slow 4s infinite;
            }
            .animate-in {
                animation: fade-in 0.3s ease-out;
            }
        `}</style>
                </div>
            )}

            <RechargeModal
                isOpen={showRechargeModal}
                onClose={() => setShowRechargeModal(false)}
                userEmail={user?.email}
            />
            <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 overflow-hidden">
                    {/* Background Elements - matching filter card style */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-50"></div>
                        <div className="absolute top-12 right-8 w-8 h-8 bg-orange-200 rounded-lg rotate-45 opacity-30"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full opacity-60"></div>
                        <div className="absolute bottom-16 left-12 w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Header Section */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="flex items-center justify-center gap-3 mb-4">

                                <div className="px-3 py-1 bg-slate-100 rounded-full">
                                    <span className="text-xs font-semibold text-slate-700">TARGETED SEARCH</span>
                                </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Filter Profiles</h2>
                            <p className="text-gray-600 text-sm sm:text-base">Enter specific criteria to find matching profiles</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-200 rounded-full flex-shrink-0"></div>
                                    {error}
                                </div>
                            )}

                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={filters.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter full name..."
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500 text-base"
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Age Range Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Age Range <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="minAge"
                                            name="minAge"
                                            min="18"
                                            max="100"
                                            value={filters.minAge}
                                            onChange={handleInputChange}
                                            placeholder="Min age"
                                            required
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500 text-base"
                                        />
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="maxAge"
                                            name="maxAge"
                                            min="18"
                                            max="100"
                                            value={filters.maxAge}
                                            onChange={handleInputChange}
                                            placeholder="Max age"
                                            required
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500 text-base"
                                        />
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Stats Preview */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Settings className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">Search Configuration</span>
                                </div>
                                <div className="text-xs text-slate-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Search Type:</span>
                                        <span className="font-medium">Name + Age Filter</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Required Fields:</span>
                                        <span className="font-medium">All (3/3)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-slate-700 to-gray-800 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-slate-500/30"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Searching Profiles...</span>
                                    </>
                                ) : (
                                    <>
                                        <Filter className="w-5 h-5" />
                                        <span>Start Search</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {/* Help Text */}
                            <div className="text-center">
                                <p className="text-xs text-gray-500">
                                    All fields are required for accurate results
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Tip */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Tip: Use exact names for better results</span>
                    </div>
                </div>
            </div>
        </div>
    );
}