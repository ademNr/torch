import React from 'react';
import { X, Instagram, Facebook, ArrowRight } from 'lucide-react';
interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string | undefined;
}
const RechargeModal = ({
    isOpen,
    onClose,
    userEmail
}: RechargeModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden relative">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pointer-events-none"></div>

                <div className="relative z-10 p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c-1.5 4-4 6-7 7 0 0 2.5 2.5 7 2.5S19 9 19 9c-3-1-5.5-3-7-7z" />
                                    <path d="M12 17.5c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-1 2.5-2.5 2.5z" />
                                    <path d="M12 22c3.5 0 6-2.5 6-6 0-2-1-4-3-5.5 0 0 .5 1.5-1 3-1.5 1.5-2 1-2 1s.5-1.5-1-3c-1.5-1.5-1-3-1-3-2 1.5-3 3.5-3 5.5 0 3.5 2.5 6 6 6z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                    Recharge Flames
                                </h2>
                                <p className="text-gray-500 text-xs">Choose your plan</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Pricing Plans */}
                    <div className="space-y-3 mb-6">
                        {/* Boufadhouh - Starter */}
                        <div className="relative bg-gray-50/80 rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/70 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Allah Le Tafthahna</h4>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-gray-700 font-medium text-sm">5</span>
                                        <span className="text-base">🔥</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Perfect to start</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-gray-900">7DT</div>
                                    <div className="text-xs text-gray-500">1.4 DT per flame</div>
                                </div>
                            </div>
                        </div>

                        {/* Nasness - Most Popular */}
                        <div className="relative bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-orange-500/20 transform hover:scale-[1.02]">
                            {/* Popular badge */}
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    MOST POPULAR
                                </div>
                            </div>

                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative flex items-center justify-between mt-1">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Beji Matrix</h4>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-orange-600 font-bold text-base">10</span>
                                        <span className="text-lg">🔥</span>
                                    </div>
                                    <p className="text-xs text-orange-700/70 font-medium">Best value choice</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">9DT</div>
                                    <div className="text-xs text-orange-600 font-semibold">0.9 DT per flame</div>
                                    <div className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full mt-1">
                                        SAVE 36%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chila Bila - Premium */}
                        <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200/70 hover:border-red-300 transition-all duration-300 cursor-pointer group">
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    PREMIUM
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Chila Bila</h4>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-red-600 font-bold text-sm">999</span>
                                        <span className="text-base">🔥</span>
                                    </div>
                                    <p className="text-xs text-red-600/70 font-medium">Ultimate package</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-red-600">29DT</div>
                                    <div className="text-xs text-gray-500">0.029 DT per flame</div>
                                    <div className="text-xs text-red-600 font-semibold">Best Deal</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50/50 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="font-semibold text-gray-800">Contact us to purchase</p>
                        </div>

                        <div className="space-y-2 mb-4">
                            <a
                                href="https://www.instagram.com/torch.tn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm"
                            >
                                <Instagram className="w-4 h-4" />
                                <span className="flex-1">Instagram</span>
                                <ArrowRight className="w-3 h-3" />
                            </a>

                            <a
                                href="https://www.facebook.com/people/Torch-tn/61579730637571"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm"
                            >
                                <Facebook className="w-4 h-4" />
                                <span className="flex-1">Facebook</span>
                                <ArrowRight className="w-3 h-3" />
                            </a>
                        </div>

                        {/* Instructions */}
                        <div className="bg-white/80 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Include when contacting:</p>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div>• Your email: <span className="font-medium text-gray-800">{userEmail}</span></div>
                                <div>• Package name</div>
                                <div>• Payment screenshot</div>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            </div>
        </div>
    );
};

export default RechargeModal;