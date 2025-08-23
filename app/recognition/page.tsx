"use client";
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ArrowRight, X, Upload, User, Sparkles, Heart, Flame, Instagram, Facebook, Clock, RefreshCw, Camera, Eye, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import Image from 'next/image';
type Match = {
    profileId: string;
    name: string;
    age: number;
    distance: number;
    imageUrls: string[];
    similarity: number;
    confidenceLevel: string;
    scrapedAt?: string;
};

type RecognitionResponse = {
    matches: Match[];
    bestMatch?: Match;
    credits: number;
    message: string;
    confidenceLevel?: string;
    error?: string;
    ready?: boolean;
    initializationInProgress?: boolean;
    processingStats?: object;
};

export default function FaceRecognitionPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<RecognitionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showSystemBusyModal, setShowSystemBusyModal] = useState(false);
    const [rechargeError, setRechargeError] = useState<string | null>(null);
    const [systemBusyMessage, setSystemBusyMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user, loading, logout, refreshUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            processImageFile(file);
        }
    };

    const processImageFile = (file: File) => {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResults(null);
        setError(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                processImageFile(file);
            } else {
                setError('Please upload an image file (JPG, PNG, WEBP)');
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage) {
            setError('Please select an image first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRechargeError(null);
        setSystemBusyMessage(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/image-search`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user!.token}`
                },
                body: formData
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

            const data: RecognitionResponse = await response.json();

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Transform matches and store in sessionStorage
            const transformedMatches = data.matches.map(match => ({
                id: String(match.profileId),
                name: match.name,
                age: String(match.age),
                distance: String(match.distance),
                imageUrls: match.imageUrls,
                bio: `${match.similarity.toFixed(1)}% similarity match - ${match.confidenceLevel} confidence`,
                interests: [`${match.similarity.toFixed(1)}% Match`],
                similarity: match.similarity,
                confidence: match.confidenceLevel
            }));

            sessionStorage.setItem('faceRecognitionResults', JSON.stringify({
                matches: transformedMatches,
                searchStats: {
                    matchesFound: data.matches.length,
                    totalCandidates: 0,
                    processingTime: 0,
                    similarityThreshold: 0.8
                },
                originalImage: previewUrl
            }));

            refreshUser();
            router.push('/dashboard');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            console.error('Recognition error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setResults(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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

    const retryRecognition = () => {
        closeSystemBusyModal();
        handleSubmit();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <Head>
                <title>Find whether someone you know is using a dating app | Face Recognition</title>
                <meta name="description" content="Find whether someone you know is using a dating app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <AppHeader
                title="Torch"
                subtitle="Upload a photo to find matching profiles"
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
                                    onClick={retryRecognition}
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

            {/* Enhanced Recharge Credits Modal */}
            {showRechargeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                        {/* Background decorative elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full opacity-60 animate-pulse"></div>
                            <div className="absolute top-16 right-12 w-12 h-12 bg-red-200 rounded-lg rotate-45 opacity-40 animate-bounce"></div>
                            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full opacity-80 animate-pulse"></div>
                            <div className="absolute bottom-20 left-16 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                            <div className="absolute top-8 left-8 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        </div>

                        <div className="relative z-10 p-6 sm:p-8">
                            {/* Enhanced Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    {/* Icon with glow effect */}
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-xl transform transition-transform duration-300 hover:scale-105">
                                            <div className="relative">
                                                {/* Credit/Coin Icon */}
                                                <svg className="w-7 h-7 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="currentColor" />
                                                    <path d="M12 6v12M9 9h6M9 15h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
                                            </div>
                                        </div>
                                        {/* Animated glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl blur-xl opacity-30 scale-110 animate-pulse"></div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-1">
                                            Insufficient Credits
                                        </h2>
                                        <p className="text-sm text-gray-500 font-medium">Account Recharge Required</p>
                                    </div>
                                </div>

                                <button
                                    onClick={closeRechargeModal}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group hover:scale-110"
                                >
                                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </button>
                            </div>

                            <div className="mb-8">


                                {/* Enhanced Recharge Options */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">

                                        <h3 className="font-bold text-gray-900 text-lg">Recharge Options</h3>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-sm transition-all duration-300 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <p className="text-gray-700 font-semibold">
                                                    Contact us via social media to recharge:
                                                </p>
                                            </div>

                                            <div className="space-y-3 mb-5">
                                                <a
                                                    href="https://www.instagram.com/torch.tn"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 font-medium transform hover:scale-[1.02] relative overflow-hidden"
                                                >
                                                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                                    <span className="flex-1">Recharge via Instagram</span>
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {/* Button shimmer effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                                                </a>

                                                <a
                                                    href="https://www.facebook.com/people/Torch-tn/61579730637571"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium transform hover:scale-[1.02] relative overflow-hidden"
                                                >
                                                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                                    <span className="flex-1">Recharge via Facebook</span>
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {/* Button shimmer effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                                                </a>
                                            </div>

                                            {/* Enhanced Instructions */}
                                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-sm text-gray-700 font-semibold">After payment, send us:</p>
                                                </div>
                                                <ul className="space-y-2 text-sm text-gray-600">
                                                    <li className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span><span className="font-medium text-gray-700">Your account email:</span> {user?.email}</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="font-medium text-gray-700">Payment screenshot</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span><span className="font-medium text-gray-700">Amount paid</span> (1 credit = 1TND)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* Enhanced Close Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={closeRechargeModal}
                                    className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium border border-gray-200 hover:border-gray-300 hover:shadow-md transform hover:scale-[1.02]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Bottom decorative gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>

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
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Hero Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Powered</span> Image Recognition
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
                        Upload any photo and let Torch analyze the image to find matching profiles
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-50"></div>
                            <div className="absolute top-12 right-8 w-8 h-8 bg-orange-200 rounded-lg rotate-45 opacity-30"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full opacity-60"></div>

                        </div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 sm:mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <div className="px-3 py-1 bg-orange-100 rounded-full">
                                        <span className="text-xs font-semibold text-orange-700">PRECISE SEARCH</span>
                                    </div>
                                </div>
                                {error && (
                                    <div className="px-3 py-1 bg-red-100 rounded-full">
                                        <span className="text-xs font-semibold text-red-700">ERROR</span>
                                    </div>
                                )}
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-200 rounded-full flex-shrink-0"></div>
                                    {error}
                                </div>
                            )}

                            {/* Upload Section */}
                            <div
                                className={`w-full rounded-xl p-6 sm:p-8 text-center flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 mb-6
                                    ${isDragging ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-300 bg-gray-50'}
                                    ${previewUrl ? 'min-h-[320px] sm:min-h-[400px]' : 'min-h-[280px] sm:min-h-[350px]'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {previewUrl ? (
                                    <div className="relative w-full max-w-sm mx-auto">
                                        <div className="aspect-square w-full overflow-hidden rounded-xl">
                                            <img

                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-xl shadow-md"
                                            />
                                        </div>
                                        <button
                                            onClick={handleReset}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4 sm:mb-6">
                                            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Upload Your Photo</h2>
                                        <p className="text-gray-600 mb-4 sm:mb-6 max-w-xs text-sm sm:text-base">
                                            Drag & drop a photo here or click to select
                                        </p>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-flex items-center cursor-pointer py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 hover:shadow-xl"
                                        >
                                            <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Select Photo
                                        </label>
                                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                                            JPG, PNG, WEBP formats accepted
                                        </p>
                                    </div>
                                )}
                            </div>



                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    className="flex-1 flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium transition-all duration-300 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                                >
                                    Reset
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !selectedImage}
                                    className={`flex-1 flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg
                                        ${isLoading || !selectedImage
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 hover:shadow-xl hover:shadow-orange-500/25'
                                        }`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Analyzing Photo...
                                        </span>
                                    ) : (
                                        <>
                                            <Camera className="w-5 h-5 mr-2" />
                                            Find Matches
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}