"use client";
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ArrowRight, X, Upload, User, Sparkles, Heart, Flame, Instagram, Facebook, Clock, RefreshCw, Camera, Eye, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';

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

            {/* System Busy Modal */}
            {showSystemBusyModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-orange-600">Processing Database</h2>
                                <button
                                    onClick={closeSystemBusyModal}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4 border border-orange-200">
                                    <div className="flex items-center mb-3">
                                        <Clock className="w-6 h-6 text-orange-500 mr-3" />
                                        <p className="text-gray-700 font-medium">
                                            Recognition system is initializing
                                        </p>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                        {systemBusyMessage}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Our database is currently being processed. This usually takes 1-5 minutes.
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <h3 className="font-medium text-gray-900 mb-3">What&apos;s happening:</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                            Our system is processing facial recognition data
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                            New profiles are being added to the database
                                        </li>
                                        <li className="flex items-center">
                                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                            Recognition models are being optimized
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeSystemBusyModal}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={retryRecognition}
                                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-bold"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recharge Credits Modal */}
            {showRechargeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-red-600">Insufficient Credits</h2>
                                <button
                                    onClick={closeRechargeModal}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-4 border border-red-200">
                                    <p className="text-gray-700 mb-3">
                                        {rechargeError || "You don't have enough credits to perform this recognition."}
                                    </p>
                                    <p className="font-semibold">Please recharge your account to continue.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">Recharge Options:</h3>

                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-3">
                                            Contact us via Instagram or Facebook to recharge your account:
                                        </p>

                                        <div className="flex flex-col gap-3">
                                            <a
                                                href="https://instagram.com/your_instagram"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                                            >
                                                <Instagram className="w-5 h-5" />
                                                <span>Recharge via Instagram</span>
                                            </a>

                                            <a
                                                href="https://facebook.com/your_facebook"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                                            >
                                                <Facebook className="w-5 h-5" />
                                                <span>Recharge via Facebook</span>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <p className="mb-2">After payment, send us:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Your account email: {user?.email}</li>
                                            <li>Transaction ID or screenshot</li>
                                            <li>Amount paid (1 credit = $1)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={closeRechargeModal}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
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