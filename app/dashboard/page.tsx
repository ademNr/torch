"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, MapPin, Calendar, Sparkles, Users, Flame, User, Search, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";
import LoadingPage from "@/components/LoadingPage";

// Update interfaces
interface User {
    id: string;
    name: string;
    age: string;
    distance: string;
    imageUrls: string[];
    bio?: string;
    interests?: string[];
    similarity?: number;
    confidence?: string;
}

interface SearchStats {
    matchesFound: number;
    totalCandidates: number;
    processingTime: number;
    similarityThreshold: number;
}

interface FaceRecognitionResults {
    matches: User[];
    searchStats: SearchStats;
    originalImage: string | null;
    searchType?: string;
}

interface UserCardProps {
    user: User;
    index: number;
    onProfileClick: (userId: string) => void;
    showSimilarity: boolean; // New prop to control similarity display
}

const UserCard = ({ user, index, onProfileClick, showSimilarity }: UserCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const handleCardClick = () => {
        onProfileClick(user.id);
    };

    return (
        <div
            className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer transform-gpu border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {imageError ? (
                    <div className="w-full h-full bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center">
                        <div className="text-center text-gray-700">
                            <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <span className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                    {user.name.charAt(0)}
                                </span>
                            </div>
                            <p className="text-lg font-semibold">{user.name}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <img
                            src={user.imageUrls[0]}
                            alt={user.name}
                            onError={() => { setImageError(true); setImageLoading(false); }}
                            onLoad={() => setImageLoading(false)}
                            className={`w-full h-full object-cover transition-all duration-700 ${imageLoading ? 'opacity-0 scale-110' : 'opacity-100'
                                } ${isHovered ? 'scale-110' : 'scale-100'}`}
                        />
                        {imageLoading && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                        )}
                    </>
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`} />

                {/* Similarity badge - Only show for image search */}
                {showSimilarity && user.similarity !== undefined && (
                    <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg">
                            {(user.similarity * 100).toFixed(0)}% Match
                        </div>
                    </div>
                )}

                {/* Profile Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                        <h3 className="text-xl font-bold mb-1 drop-shadow-lg">{user.name}</h3>
                        <div className="flex items-center gap-3 text-white/90">
                            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">{user.age} years</span>
                            </div>
                        </div>
                    </div>

                    {/* Confidence badge - Only show for image search */}
                    {showSimilarity && user.confidence && (
                        <div className="flex items-center gap-2 mt-2">
                            <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                                {user.confidence} confidence
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hover overlay with simple effect */}
            <div className={`absolute inset-0 bg-black/10 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                }`} />
        </div>
    );
};

export default function LookAlikeDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [faceRecognitionStats, setFaceRecognitionStats] = useState<SearchStats | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [searchType, setSearchType] = useState<string>('image');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedResults = sessionStorage.getItem('faceRecognitionResults');
        if (storedResults) {
            try {
                const parsedData: FaceRecognitionResults = JSON.parse(storedResults);
                setUsers(parsedData.matches);
                setFaceRecognitionStats(parsedData.searchStats);
                setOriginalImage(parsedData.originalImage);
                setSearchType(parsedData.searchType || 'image');
                setIsLoading(false);
            } catch (error) {
                console.error('Error parsing session data:', error);
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }, [router]);

    const handleProfileClick = (userId: string) => {
        // Store the selected user in sessionStorage
        const selectedUser = users.find(user => user.id === userId);
        if (selectedUser) {
            sessionStorage.setItem('selectedUser', JSON.stringify(selectedUser));
        }
        router.push(`/dashboard/${userId}`);
    };

    if (!isClient || isLoading) {
        return <LoadingPage message="Loading" />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Enhanced Header */}
            <AppHeader
                title={"Torch"}
            />

            {/* Enhanced Face Recognition Stats Section */}
            {faceRecognitionStats && searchType === 'image' && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50">
                        <div className="flex flex-col lg:flex-row gap-8 items-center">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src={originalImage || ''}
                                        alt="Your uploaded photo"
                                        className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-4 border-white"
                                    />

                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg border border-gray-200">
                                        <span className="text-xs font-semibold text-gray-700"> ? </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-center lg:text-left">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        Recognition Results
                                    </h2>
                                    <p className="text-gray-600 text-lg">
                                        Analysis completed successfully
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Enhanced Results Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-12 py-8">
                {users.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Your Matches ({users.length})
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    {searchType === 'image' ? 'Sorted by similarity score' : 'Matching your criteria'}
                                </p>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {users.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="animate-in fade-in slide-in-from-bottom duration-700"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <UserCard
                                        user={user}
                                        index={index}
                                        onProfileClick={handleProfileClick}
                                        showSimilarity={searchType === 'image'} // Pass the search type
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-24">
                        <div className="max-w-md mx-auto">
                            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 opacity-80 shadow-2xl shadow-red-500/25">
                                <Users className="w-16 h-16 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">
                                {searchType === 'image' ? 'No Torch Matches Found' : 'No Filter Matches Found'}
                            </h3>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {searchType === 'image'
                                    ? "We couldn't find anyone who looks similar. Try uploading a different photo of the same person."
                                    : "No profiles match your search criteria. Try adjusting your filters for better results."
                                }
                            </p>
                            <div className="space-y-4">
                                <button
                                    onClick={() => router.push(searchType === 'image' ? '/recognition' : '/filter')}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                                >
                                    {searchType === 'image' ? 'Try Another Photo' : 'Adjust Filters'}
                                </button>
                                <p className="text-sm text-gray-500">
                                    {searchType === 'image'
                                        ? 'Make sure the photo is clear enough'
                                        : 'Try broadening your search criteria'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}