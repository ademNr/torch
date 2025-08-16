"use client";
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ArrowRight, X, Upload, User, Sparkles, Heart, Flame, Instagram, Facebook, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';

type Match = {
    person: {
        id: string;
        name: string;
        age: string;
        distance: string;
        imageCount: number;
        imageUrls: string[];
    };
    similarity: number;
    confidence: string;
};

type RecognitionResponse = {
    success: boolean;
    match: boolean;
    matches: Match[];
    searchStats: {
        totalCandidates: number;
        matchesFound: number;
        processingTime: number;
        signatureTime: number;
        matchTime: number;
        similarityThreshold: number;
    };
    credits?: number;
    error?: string;
    message?: string;
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
            router.push("/login");
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recognize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user!.token}`
                },
                body: formData
            });

            if (response.status === 401) {
                // Force logout
                logout();
                router.push('/login');
                return;
            }

            if (response.status === 402) {
                const errorData = await response.json();
                setRechargeError(errorData.message);
                setShowRechargeModal(true);
                refreshUser();
                return;
            }
            const data: RecognitionResponse = await response.json();
            // Enhanced system busy detection


            if (data.error == "Recognition system not ready") {
                setSystemBusyMessage(
                    data.message ||
                    data.error ||
                    "Database is still being processed. Please try again in a few moments."
                );
                setShowSystemBusyModal(true);
                return;
            }
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }


            // Debug logging
            console.log('Full Response data:', JSON.stringify(data, null, 2));
            console.log('Success:', data.success);
            console.log('Error:', data.error);
            console.log('Message:', data.message);
            console.log('Ready:', data.ready);
            console.log('InitializationInProgress:', data.initializationInProgress);





            setResults(data);

            // Store results in sessionStorage and navigate to dashboard
            if (data.success) {
                const transformedMatches = data.matches.map(match => ({
                    id: match.person.id,
                    name: match.person.name,
                    age: match.person.age,
                    distance: match.person.distance,
                    imageUrls: match.person.imageUrls,
                    bio: `${match.similarity.toFixed(1)}% similarity match - ${match.confidence} confidence`,
                    interests: [`${match.similarity.toFixed(1)}% Match`],
                    similarity: match.similarity,
                    confidence: match.confidence
                }));

                sessionStorage.setItem('faceRecognitionResults', JSON.stringify({
                    matches: transformedMatches,
                    searchStats: data.searchStats,
                    hasMatches: data.match,
                    originalImage: previewUrl
                }));
                refreshUser();
                router.push('/dashboard');
            }
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

    const similarityToPercentage = (similarity: number) => {
        return `${similarity.toFixed(1)}%`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
            <Head>
                <title>Find whether someone you know is using a dating app | Face Recognition</title>
                <meta name="description" content="Find whether someone you know is using a dating app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header */}
            <AppHeader
                title="Torch"
                subtitle="Upload a photo to find her/him"
            />

            {showSystemBusyModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-orange-600">Processing Database</h2>
                                <button
                                    onClick={closeSystemBusyModal}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-4 border border-orange-100">
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
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={retryRecognition}
                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all"
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-red-600">Insufficient Credits</h2>
                                <button
                                    onClick={closeRechargeModal}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-4 border border-red-100">
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
                                                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                                            >
                                                <Instagram className="w-5 h-5" />
                                                <span>Recharge via Instagram</span>
                                            </a>

                                            <a
                                                href="https://facebook.com/your_facebook"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transition-all"
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
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Lets find out on <span className="text-red-500">Torch</span>
                    </h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Upload a photo to find out if he/she is using a dating app !!
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Centered Upload Section */}
                        <div className="flex flex-col items-center justify-center">
                            <div
                                className={`w-full max-w-md mx-auto rounded-2xl p-8 text-center flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300
                                    ${isDragging ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-300'}
                                    ${previewUrl ? 'min-h-[400px]' : 'min-h-[450px]'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {previewUrl ? (
                                    <div className="relative w-full h-full">
                                        <div className="relative aspect-square w-full mx-auto overflow-hidden rounded-xl">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-xl shadow-md"
                                            />
                                        </div>
                                        <button
                                            onClick={handleReset}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
                                            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Your Photo</h2>
                                        <p className="text-gray-600 mb-6 max-w-xs">
                                            Drag & drop your photo here or click the button below
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
                                            className="inline-flex items-center cursor-pointer py-3 px-8 rounded-full font-medium transition-all duration-300 shadow-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-xl"
                                        >
                                            <Upload className="w-5 h-5 mr-2" />
                                            Select Photo
                                        </label>
                                        <p className="mt-4 text-sm text-gray-500">
                                            JPG, PNG, WEBP formats accepted
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 w-full max-w-md flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    className="flex-1 flex items-center justify-center py-3 px-4 rounded-full font-medium transition-all duration-300 bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                    Reset
                                </button>



                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !selectedImage}
                                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-full font-bold transition-all duration-300 shadow-lg
                                        ${isLoading || !selectedImage
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-xl'
                                        }`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </span>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Find Matches
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