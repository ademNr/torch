// components/AppHeader.tsx
"use client";

import { Flame, Search, Sparkles, LogOut, RefreshCw, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FireIcon from './FireIcon';

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    showNewSearch?: boolean;
}

export default function AppHeader({
    title = "Torch Results",
    subtitle = "People who look like you",
    showNewSearch = true
}: AppHeaderProps) {
    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshUser();
        } finally {
            setRefreshing(false);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            <FireIcon className=" text-red-500 " size={38} />

                            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent truncate">
                                {title}
                            </h1>

                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-full px-4 py-2 border border-red-100">
                                    <Sparkles className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-gray-600">Credits: {user.credits}</span>
                                </div>

                                <button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    title="Refresh credits"
                                >
                                    {refreshing ? (
                                        <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <RefreshCw className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                            </div>
                        )}

                        {showNewSearch && user && (
                            <button
                                onClick={() => router.push("/")}
                                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2.5 px-6 rounded-2xl font-semibold hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                            >
                                <Search className="w-4 h-4" />
                                New Search
                            </button>
                        )}

                        {user && (
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button and Credits */}
                    <div className="flex md:hidden items-center gap-2">
                        {user && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-red-50 to-orange-50 rounded-full px-2 sm:px-3 py-1.5 border border-red-100">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                <span className="text-xs sm:text-sm text-gray-600">{user.credits}</span>
                            </div>
                        )}

                        {user && (
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                title="Refresh credits"
                            >
                                {refreshing ? (
                                    <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <RefreshCw className="w-4 h-4 text-gray-600" />
                                )}
                            </button>
                        )}

                        {user && (
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <Menu className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && user && (
                    <div className="md:hidden mt-4 pb-3 border-t border-gray-200/50">
                        <div className="flex flex-col gap-3 pt-3">
                            {showNewSearch && (
                                <button
                                    onClick={() => {
                                        router.push("/");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-2xl font-semibold w-full"
                                >
                                    <Search className="w-4 h-4" />
                                    New Search
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-medium w-full"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}