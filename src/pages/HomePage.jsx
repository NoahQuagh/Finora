import React, { useState } from "react"
import { Plus } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../hooks/Usedashboard"

import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Separator } from "../components/ui/separator.jsx"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"

import { AppSidebar, NAV } from "../components/layout/AppSidebar"
import { StatCards } from "../components/ui/Statcards"
import { BalanceChart } from "../components/ui/Balancechart"
import { BreakdownCards } from "../components/ui/Breakdowncards"
import { RecentTransactions } from "../components/ui/Recenttransactions"

export function Home() {
    const { user, logout } = useAuth()
    const { data, loading, isDemo } = useDashboard()
    const [view, setView] = useState("accueil")

    if (loading || !data) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1b1e] text-white text-sm">
                Chargement de tes finances...
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar user={user} onLogout={logout} view={view} onNavigate={setView} />

            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.07] px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-5" />
                    <h1 className="text-sm font-medium">FINORA</h1>

                    <div className="ml-auto flex items-center gap-3">
                        {isDemo && <Badge variant="outline" className="text-muted-foreground">Données d'exemple</Badge>}
                        <Button variant="default" size="sm" onClick={() => setView("transactions")}>
                            <Plus className="size-4 mr-1" /> Nouvelle transaction
                        </Button>
                    </div>
                </header>

                <main className="flex-1 space-y-4 p-4 md:p-6">
                    {view === "accueil" ? (
                        <>
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
                                    />
                                </div>
                            </div>
                            <RecentTransactions transactions={data.transactions} />
                        </>
                    ) : (
                        <Card className="border-white/10">
                            <CardContent className="py-16 text-center text-muted-foreground">
                                La page « FINORA » arrive bientôt.
                            </CardContent>
                        </Card>
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}