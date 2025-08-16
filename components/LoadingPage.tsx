import React from 'react';

interface LoadingPageProps {
    message?: string;
    subtitle?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
    message = "Loading...",
    subtitle
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="text-center space-y-8">
                {/* Animated Loader */}
                <div className="relative">
                    <div className="w-20 h-20 mx-auto animate-spin rounded-full border-4 border-orange-200 border-t-orange-500 shadow-lg"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-gray-800">{message}</h1>
                    {subtitle && (
                        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Optional animated dots */}
                <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;