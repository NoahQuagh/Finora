import React, { useEffect, useState, useCallback } from "react"
import { Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { RecentTransactions } from "../components/ui/Recenttransactions"

export function TransactionPage() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchAllTransactions = useCallback(() => {
        setLoading(true)
        fetch("/api/transactions/getTransactions.php", { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (data.success && Array.isArray(data.transactions)) {
                    setTransactions(data.transactions)
                }
            })
            .catch((err) => console.error("Erreur chargement transactions :", err))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        fetchAllTransactions()
    }, [fetchAllTransactions])

    const filteredTransactions = transactions.filter((t) =>
        t.libelle.toLowerCase().includes(search.toLowerCase()) ||
        (t.categorie && t.categorie.toLowerCase().includes(search.toLowerCase())) ||
        (t.budget && t.budget.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-4">
            <Card className="border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-semibold text-white">Toutes les transactions</CardTitle>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Rechercher une transaction..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-muted-foreground outline-none focus:border-white/30"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-40 items-center justify-center text-muted-foreground">
                            <Loader2 className="size-5 animate-spin mr-2" /> Chargement des transactions...
                        </div>
                    ) : (
                        <RecentTransactions
                            transactions={filteredTransactions}
                            title=""
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}