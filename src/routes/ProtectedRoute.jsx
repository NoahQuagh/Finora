import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
                <p>Chargement de Finora...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}