"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            // Fetch fresh user data
            fetch("/api/auth/me", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: storedToken }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setUser(data.user);
                    } else {
                        // Token invalid
                        logout();
                    }
                })
                .catch(() => logout())
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        if (!token) return;
        try {
            const res = await fetch("/api/auth/me", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const login = async (identifier: string, password: string) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            setToken(data.token);
            setUser(data.user);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                router.push("/admin");
            } else if (data.user.role === "guider") {
                router.push("/dashboard/guider");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
