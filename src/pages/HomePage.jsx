import React from "react";
import { useAuth } from "../context/AuthContext";

export function Home() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold">Finora - Tableau de bord</h1>
                <div className="flex items-center gap-4">
                    <span>Bienvenue, <strong>{user?.nom}</strong> ({user?.email})</span>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-sm rounded transition"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="mt-6">
                <p>Bienvenue sur ta page d'accueil sécurisée.</p>
            </main>
        </div>
    );
}