import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../common/card.jsx"
import { Button } from "../common/button.jsx"
import { formatEUR } from "../lib/Format"

function Row({ label, value, max, delay, color = "#4B6FD6" }) {
    const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
    return (
        <li className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium tabular-nums">{formatEUR(value)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
        </li>
    )
}

function List({ title, items = [] }) {
    const max = Math.max(...items.map((i) => i.solde), 1)
    return (
        <Card className="border-white/10 h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {items.map((it, i) => (
                        <Row key={it.id || i} label={it.nom} value={it.solde} max={max} delay={0.1 + i * 0.08} color={it.couleur} />
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

export function BreakdownCards({ comptes, budgets, epargnes = [], prelevements = [], onRefresh }) {
    const [loadingId, setLoadingId] = useState(null)

    const handleValidate = async (id) => {
        setLoadingId(id)
        try {
            const res = await fetch("/api/transactions/validePending.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id }),
            })
            const data = await res.json()
            if (data.success && onRefresh) onRefresh()
        } catch (err) {
            console.error("Erreur lors de la validation :", err)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="space-y-4">
            {/* Grille sur 3 colonnes pour occuper toute la largeur */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <List title="Comptes" items={comptes} />
                <List title="Budgets" items={budgets} />

                {/* Prélèvements intégrés directement dans la grille */}
                <Card className="border-white/10 h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Clock className="size-4 text-white" /> Prélèvements en attente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {prelevements.length > 0 ? (
                            <ul className="space-y-3">
                                {prelevements.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/5 p-2.5 text-xs">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-foreground truncate">{item.libelle}</p>
                                            <p className="text-[10px] text-muted-foreground">{item.date} · {item.compte}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={"font-semibold tabular-nums " + (item.montant < 0 ? "text-red-400" : "text-emerald-400")}>
                                                {formatEUR(item.montant)}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                loading={loadingId === item.id}
                                                onClick={() => handleValidate(item.id)}
                                                className="h-7 w-7 p-0 border-white/20 hover:bg-emerald-500/20 hover:text-emerald-400"
                                                title="Valider l'arrivée sur le compte"
                                            >
                                                <Check className="size-3.5" />{/*TODO VOIR ICON*/}
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground py-4 text-center">
                                Aucun prélèvement en attente.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Section Épargnes & Investissements en bas */}
            {epargnes.length > 0 && (
                <Card className="border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Détail des épargnes & investissements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {epargnes.map((item) => (
                                <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                                    <span className="font-medium text-foreground">{item.nom}</span>
                                    <span className="font-semibold tabular-nums text-emerald-400">{formatEUR(item.solde)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}