import React from 'react';
import { Sparkles, Zap, Users, Search } from 'lucide-react';

interface LoadingPageProps {
    message?: string;
    subtitle?: string;
    showFeatures?: boolean;
    variant?: 'default' | 'search' | 'profile' | 'data';
}

const LoadingPage: React.FC<LoadingPageProps> = ({
    message = "Loading...",
    subtitle = "Please wait while we prepare everything for you",
    showFeatures = false,
    variant = 'default'
}) => {
    const getVariantContent = () => {
        switch (variant) {
            case 'search':
                return {
                    icon: <Search className="w-11 h-11 sm:w-14 sm:h-14 text-white drop-shadow-lg" />,
                    message: "Searching profiles...",
                    subtitle: "Finding the perfect matches for you"
                };
            case 'profile':
                return {
                    icon: <Users className="w-11 h-11 sm:w-14 sm:h-14 text-white drop-shadow-lg" />,
                    message: "Loading profiles...",
                    subtitle: "Preparing your personalized recommendations"
                };
            case 'data':
                return {
                    icon: <Zap className="w-11 h-11 sm:w-14 sm:h-14 text-white drop-shadow-lg" />,
                    message: "Processing data...",
                    subtitle: "Analyzing millions of profiles with precision"
                };
            default:
                return {
                    icon: (
                        <svg className="w-11 h-11 sm:w-14 sm:h-14 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                            <path d="M12 2c-1.5 4-4 6-7 7 0 0 2.5 2.5 7 2.5S19 9 19 9c-3-1-5.5-3-7-7z" />
                            <path d="M12 17.5c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-1 2.5-2.5 2.5z" />
                            <path d="M12 22c3.5 0 6-2.5 6-6 0-2-1-4-3-5.5 0 0 .5 1.5-1 3-1.5 1.5-2 1-2 1s.5-1.5-1-3c-1.5-1.5-1-3-1-3-2 1.5-3 3.5-3 5.5 0 3.5 2.5 6 6 6z" />
                        </svg>
                    ),
                    message,
                    subtitle
                };
        }
    };

    const variantContent = getVariantContent();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md sm:max-w-lg">
                {/* Main Loading Card */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-60 animate-pulse"></div>
                        <div className="absolute top-16 right-12 w-12 h-12 bg-orange-200 rounded-lg rotate-45 opacity-40 animate-bounce"></div>
                        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full opacity-80 animate-pulse"></div>
                        <div className="absolute bottom-20 left-16 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>

                    </div>

                    <div className="relative z-10 p-8 sm:p-10">
                        {/* Logo/Icon Section */}
                        <div className="flex justify-center mb-8 sm:mb-10">
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-transform duration-300 animate-pulse">
                                    {variantContent.icon}
                                </div>
                                {/* Animated glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur-xl opacity-30 scale-110 animate-pulse"></div>

                                {/* Rotating ring loader */}
                                <div className="absolute -inset-2 border-4 border-transparent border-t-orange-500 border-b-orange-500 border-l-red-500 border-r-red-500 rounded-2xl animate-spin"></div>
                            </div>
                        </div>

                        {/* Header Text */}
                        <div className="text-center mb-8 sm:mb-10">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                                    {variantContent.message}
                                </span>
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm mx-auto">
                                {variantContent.subtitle}
                            </p>
                        </div>





                    </div>


                </div>

            </div>


        </div>
    );
};

export default LoadingPage;