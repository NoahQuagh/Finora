import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/auth/me.php", { credentials: "include" });
                const data = await response.json();

                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Erreur de session:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout.php", { credentials: "include" });
        } catch (err) {
            console.error("Erreur logout:", err);
        } finally {
            setUser(null);
            sessionStorage.removeItem("finora_user");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);