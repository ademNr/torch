"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, User, ArrowRight, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";

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
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
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

    const handleSubmit = async (e: React.FormEvent) => {
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

            if (!response.ok) {
                throw new Error(`Search failed: ${response.statusText}`);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <AppHeader
                title="Torch"
                subtitle="Find profiles by name and age"
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