import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

// Utilisation d'imports relatifs propres vers ui/
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await fetch("/api/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (data.success) {
                window.location.href = "/"
            } else {
                setError(data.message || "Identifiants incorrects")
            }
        } catch (err) {
            setError("Impossible de contacter le serveur backend.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-6 bg-[#1a1b1e] text-foreground">
            <header className="flex w-full items-center justify-between text-xs sm:text-sm">
                <span className="text-base font-semibold tracking-tight">⌢ Finora</span>
                <div className="text-muted-foreground">
                    Pas de compte ?{" "}
                    <a href="#signup" className="font-medium text-foreground hover:underline">
                        S'inscrire
                    </a>
                </div>
            </header>

            <main className="my-6 flex w-full flex-1 items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[460px]"
                >
                    <Card className="rounded-3xl border-white/10 bg-card/80 py-8 shadow-2xl backdrop-blur-xl">
                        <CardHeader className="px-8 sm:px-10">
                            <CardTitle className="text-3xl font-bold tracking-tight">
                                Se connecter à Finora
                            </CardTitle>
                            <CardDescription className="leading-relaxed">
                                Entre tes identifiants pour accéder à tes comptes et à tes budgets.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-8 sm:px-10">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        role="alert"
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-xs font-medium text-red-400"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nom@exemple.com"
                                            className="h-11 rounded-xl bg-background/60 pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-11 rounded-xl bg-background/60 pl-10 pr-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className="mt-2 w-full h-11 rounded-xl">
                                    {loading ? "Connexion en cours..." : "Se connecter"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            <footer className="flex w-full items-center justify-end gap-6 text-xs text-muted-foreground">
                <a href="#" className="transition hover:text-foreground">Conditions</a>
                <a href="#" className="transition hover:text-foreground">Confidentialité</a>
            </footer>
        </div>
    )
}