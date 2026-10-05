import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch("/api/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                login(data.user);
                navigate("/home");
            } else {
                setError(data.message || "Identifiants incorrects.");
            }
        } catch (err) {
            setError("Impossible de contacter le serveur backend.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-zinc-900 p-6 rounded-lg shadow-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Connexion à Finora</h1>

                {error && <div className="p-3 bg-red-500/20 text-red-400 text-sm rounded">{error}</div>}

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 rounded bg-zinc-800 border  focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 rounded bg-zinc-800 border  focus:outline-none "
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 font-semibold rounded transition duration-200 disabled:opacity-50"
                >
                    {submitting ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
}