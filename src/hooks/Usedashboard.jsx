import { useEffect, useState, useCallback } from "react"

export function useDashboard() {
    const [state, setState] = useState({
        data: null,
        loading: true,
        isDemo: false
    })

    const fetchDashboard = useCallback(() => {
        fetch("/api/dashboard/loadStatCard.php", { credentials: "include" })
            .then((r) => {
                if (!r.ok) throw new Error("Erreur HTTP " + r.status)
                return r.json()
            })
            .then((json) => {
                if (json?.success && json.data) {
                    setState({ data: json.data, loading: false, isDemo: false })
                } else {
                    setState({ data: null, loading: false, isDemo: true })
                }
            })
            .catch(() => {
                setState({ data: null, loading: false, isDemo: true })
            })
    }, [])

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    return {
        ...state,
        refetch: fetchDashboard
    }
}