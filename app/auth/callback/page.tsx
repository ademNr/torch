"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/components/LoadingPage";

// Wrap the content that uses useSearchParams in a separate component
function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            try {
                const parts = token.split(".");
                if (parts.length !== 3) {
                    throw new Error("Invalid token format");
                }

                const payload = JSON.parse(atob(parts[1]));

                login({
                    id: payload.id,
                    email: payload.email,
                    name: payload.name,
                    credits: payload.credits
                }, token);

                // Redirect after successful login
                router.push("/");
            } catch (error) {
                console.error("Authentication failed:", error);
                setError("Authentication failed. Invalid token format");
                router.push("/login?error=auth_failed");
            }
        } else {
            setError("Missing authentication token");
            router.push("/");
        }
    }, [token, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return <LoadingPage message="Authenticating..." />;
}

// Main component with Suspense boundary
export default function AuthCallback() {
    return (
        <Suspense fallback={<LoadingPage message="Loading authentication..." />}>
            <AuthCallbackContent />
        </Suspense>
    );
}