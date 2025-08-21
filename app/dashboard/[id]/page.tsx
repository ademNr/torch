"use client";
import {
    ArrowLeft,
    Calendar,
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Verified,
    Star,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Flame
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface User {
    id: string;
    name: string;
    age: string;
    distance: string | null;
    imageUrls: string[];
    bio?: string;
    interests?: string[];
    job?: string;
    education?: string;
    location?: string;
    isVerified?: boolean;
    rating?: number;
    similarity?: number;
    confidence?: string;
    searchType?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [searchType, setSearchType] = useState<string>('image');
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        if (params.id) {
            setIsLoading(true);
            const storedUser = sessionStorage.getItem('selectedUser');
            const storedResults = sessionStorage.getItem('faceRecognitionResults');

            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);

                if (storedResults) {
                    try {
                        const parsedResults = JSON.parse(storedResults);
                        setSearchType(parsedResults.searchType || 'image');
                    } catch (e) {
                        console.error('Error parsing search results:', e);
                    }
                }

                setUser(parsedUser);
                setIsLoading(false);
            } else {
                console.log('User data not found in session storage');
                setIsLoading(false);
            }
        }
    }, [params.id]);

    const nextImage = () => {
        if (user && user.imageUrls.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % user.imageUrls.length);
        }
    };

    const prevImage = () => {
        if (user && user.imageUrls.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + user.imageUrls.length) % user.imageUrls.length);
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.target as HTMLImageElement;
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse shadow-xl md:shadow-2xl">
                        <Flame className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Loading Profile</h2>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 opacity-80 shadow-xl md:shadow-2xl">
                        <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-white" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                        We couldn&apos;t find the profile you&apos;re looking for. It might have been removed or doesn&apos;t exist.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-semibold text-sm md:text-base hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Enhanced Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-sm md:shadow-md hover:shadow-lg transition-all duration-300 font-medium text-gray-700 hover:scale-105 text-sm md:text-base"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                            Back
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Enhanced Image Gallery */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="relative">
                            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border border-gray-200 bg-gray-100">
                                <div className="relative pb-[125%] md:pb-[100%]"> {/* Adjusted aspect ratio for mobile */}
                                    <img
                                        src={user.imageUrls[currentImageIndex] || user.imageUrls[0]}
                                        alt={user.name}
                                        onLoad={handleImageLoad}
                                        className="absolute inset-0 w-full h-full object-cover md:object-contain"
                                    />
                                </div>

                                {/* Gradient overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                                {/* Image Navigation */}
                                {user.imageUrls.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg"
                                        >
                                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg"
                                        >
                                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </button>
                                    </>
                                )}

                                {/* Image Indicators */}
                                {user.imageUrls.length > 1 && (
                                    <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2">
                                        {user.imageUrls.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                                    ? 'bg-white shadow-lg'
                                                    : 'bg-white/40 hover:bg-white/60'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Match Percentage Badge - Only show for image search */}
                                {searchType === 'image' && user.similarity !== undefined && (
                                    <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg backdrop-blur-sm">
                                        {(user.similarity * 100).toFixed(0)}% Match
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Thumbnail Gallery */}
                            {user.imageUrls.length > 1 && (
                                <div className="flex gap-2 md:gap-3 mt-3 md:mt-4 overflow-x-auto pb-2 hide-scrollbar">
                                    {user.imageUrls.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md ${index === currentImageIndex
                                                ? 'border-red-500 scale-105 md:scale-110 shadow-lg'
                                                : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Profile Information */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Main Profile Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg md:shadow-xl border border-gray-200/50">
                            <div className="flex items-start justify-between mb-4 md:mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            {user.name}
                                        </h1>
                                        {user.isVerified && (
                                            <div className="bg-blue-500 rounded-full p-1 md:p-1.5 shadow-md md:shadow-lg">
                                                <Verified className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600 mb-3 md:mb-4">
                                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                                        <span className="font-medium text-base md:text-lg">{user.age} years old</span>
                                    </div>

                                    {/* Confidence Level - Only show for image search */}
                                    {searchType === 'image' && user.confidence && (
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl md:rounded-2xl px-3 py-1.5 md:px-4 md:py-2 mb-3 md:mb-4">
                                            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                                {user.confidence} confidence match
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Match Statistics - Only show for image search */}
                        {searchType === 'image' && user.similarity !== undefined && (
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-red-100">
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                                    <Star className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                                    Match Analysis
                                </h3>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm md:text-base text-gray-700">Facial Similarity</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 md:w-24 bg-gray-200 rounded-full h-1.5 md:h-2">
                                                <div
                                                    className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 md:h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${user.similarity * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-bold text-red-600 text-sm md:text-base">{(user.similarity * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    {user.confidence && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm md:text-base text-gray-700">Confidence Level</span>
                                            <span className="font-semibold text-gray-900 capitalize text-sm md:text-base">{user.confidence}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>



            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}