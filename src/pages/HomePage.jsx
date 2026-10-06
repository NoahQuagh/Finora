import React from "react"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../hooks/Usedashboard"

import { StatCards } from "../components/ui/Statcards"
import { BreakdownCards } from "../components/ui/Breakdowncards"
import { RecentTransactions } from "../components/ui/Recenttransactions"

export function Home() {
    const { user, logout } = useAuth()
    const { data, loading, isDemo, refetch } = useDashboard()


    if (loading || !data) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1b1e] text-white text-sm">
                Chargement de tes finances...
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Bienvenue, <strong className="text-foreground">{user?.nom}</strong>.
            </p>

            <StatCards data={data} />

            <div className="grid gap-4 xl:grid-cols-5">
                <div className="xl:col-span-5">
                    <BreakdownCards
                        comptes={data.comptes}
                        budgets={data.budgets}
                        epargnes={data.epargne}
                        prelevements={data.prelevement}
                        onRefresh={refetch}
                    />
                </div>
            </div>

            <RecentTransactions transactions={data.transactions} title="Dernières transactions" />
        </div>
    )
}