// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: string;
    email: string;
    name: string;
    credits: number;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: Omit<User, "token">, token: string) => void;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);
    // Memoize login function
    const login = useCallback((userData: Omit<User, "token">, token: string) => {
        const userObj: User = { ...userData, token };
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
    }, []);

    // Memoize logout function
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.clear();
        router.push("/");
    }, [router]);

    // Add refreshUser function
    const refreshUser = useCallback(async () => {
        if (!user) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                const updatedUser = { ...user, ...userData };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

            } else if (response.status === 401) {
                logout();
            }
        } catch (error) {
            console.error('Failed to refresh user data', error);
        }
    }, [user, logout]);

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        refreshUser

    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}