import { useEffect, useState } from "react"

export function useDashboard() {
    const [state, setState] = useState({
        data: null,
        loading: true,
        isDemo: false
    })

    useEffect(() => {
        let alive = true

        fetch("/api/dashboard/loadStatCard.php", { credentials: "include" })
            .then((r) => {
                if (!r.ok) throw new Error("Erreur HTTP " + r.status)
                return r.json()
            })
            .then((json) => {
                if (alive && json?.success && json.data) {
                    setState({ data: json.data, loading: false, isDemo: false })
                } else {
                    // Fallback sur le mock uniquement en cas d'erreur de réponse
                    setState({ data: dashboardMock, loading: false, isDemo: true })
                }
            })
            .catch(() => {
                if (alive) {
                    // Fallback sur le mock si le serveur backend est injoignable
                    setState({ data: dashboardMock, loading: false, isDemo: true })
                }
            })

        return () => {
            alive = false
        }
    }, [])

    return state
}