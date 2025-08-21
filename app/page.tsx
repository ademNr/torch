"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Filter, Sparkles, ArrowRight, Search, Eye, Zap, Target, Upload, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isHoveredImage, setIsHoveredImage] = useState(false);
  const [isHoveredFilter, setIsHoveredFilter] = useState(false);

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push("/landing");
    return null;
  }

  const navigateToImageSearch = () => {
    router.push("/recognition");
  };

  const navigateToFilterSearch = () => {
    router.push("/filter");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <AppHeader
        title="Torch"
        subtitle="Choose your search method"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Find Anyone, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Anywhere</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
            Choose your preferred search method and let our AI do the heavy lifting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {/* Image Recognition Card - Photo Upload Style */}
          <div
            className={`group relative overflow-hidden transition-all duration-700 cursor-pointer
              ${isHoveredImage ? 'transform scale-[0.98] sm:scale-[1.02]' : ''}`}
            onMouseEnter={() => setIsHoveredImage(true)}
            onMouseLeave={() => setIsHoveredImage(false)}
            onClick={navigateToImageSearch}
          >
            {/* Main Card */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 min-h-[400px] sm:min-h-[480px] flex flex-col">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 border border-orange-200 rounded-full"></div>
                <div className="absolute top-12 right-12 w-8 h-8 border border-red-200 rounded-full"></div>
                <div className="absolute bottom-8 left-6 w-12 h-12 border border-orange-200 rounded-full"></div>
                <div className="absolute bottom-16 left-12 w-4 h-4 bg-red-100 rounded-full"></div>
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="px-3 py-1 bg-orange-100 rounded-full">
                      <span className="text-xs font-semibold text-orange-700">PRECISE - SNIPER SHOT</span>
                    </div>
                  </div>
                  <div className={`transition-transform duration-500 ${isHoveredImage ? 'rotate-12' : ''}`}>
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  Image<br />Recognition
                </h2>

                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed flex-1">
                  Simply upload any photo and our advanced AI will analyze facial features to find matching profiles across our database. Perfect for visual searches.
                </p>

                {/* Features - Mobile Optimized */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <Eye className="w-4 h-4 text-orange-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Image search</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
                    <Zap className="w-4 h-4 text-red-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Instant</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Accurate</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
                    <Sparkles className="w-4 h-4 text-red-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Smart</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="group/btn w-full py-4 sm:py-5 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-orange-500/25">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                  Upload Photo
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 transition-opacity duration-500 ${isHoveredImage ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          </div>

          {/* Filter Search Card - Form Style */}
          <div
            className={`group relative overflow-hidden transition-all duration-700 cursor-pointer
              ${isHoveredFilter ? 'transform scale-[0.98] sm:scale-[1.02]' : ''}`}
            onMouseEnter={() => setIsHoveredFilter(true)}
            onMouseLeave={() => setIsHoveredFilter(false)}
            onClick={navigateToFilterSearch}
          >
            {/* Main Card */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 min-h-[400px] sm:min-h-[480px] flex flex-col">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-50"></div>
                <div className="absolute top-12 right-8 w-8 h-8 bg-orange-200 rounded-lg rotate-45 opacity-30"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-orange-50 to-red-50 rounded-full opacity-60"></div>
                <div className="absolute bottom-16 left-12 w-2 h-2 bg-orange-400 rounded-full"></div>
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-slate-700 to-gray-800 rounded-xl">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-full">
                      <span className="text-xs font-semibold text-slate-700">TARGETED - MACHINE GUN</span>
                    </div>
                  </div>
                  <div className={`transition-transform duration-500 ${isHoveredFilter ? '-rotate-12' : ''}`}>
                    <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  Filter<br />Search
                </h2>

                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed flex-1">
                  Use specific criteria like name, age range, and location to narrow down your search. Get targeted results when you know what you&apos;re looking for.
                </p>

                {/* Mock Form Elements - Mobile Optimized */}
                <div className="space-y-3 mb-6 sm:mb-8">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-600 font-medium">Enter name...</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-600">Min age</span>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-600">Max age</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="group/btn w-full py-4 sm:py-5 px-6 bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3">
                  <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
                  Start Filtering
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 transition-opacity duration-500 ${isHoveredFilter ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          </div>
        </div>

        {/* Bottom Stats - Mobile Friendly */}
        {/* <div className="mt-8 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
          <div className="text-center p-3 sm:p-4">
            <div className="text-xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">99%</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Accuracy</div>
          </div>
          <div className="text-center p-3 sm:p-4 border-x border-gray-200">
            <div className="text-xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">&lt;3s</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Average Speed</div>
          </div>
          <div className="text-center p-3 sm:p-4">
            <div className="text-xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Available</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}