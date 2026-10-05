const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export const formatEUR = (n) => EUR.format(Math.abs(n) < 0.005 ? 0 : n)
export const formatSigned = (n) => (n > 0 ? "+" : "") + formatEUR(n)

export const formatDateShort = (iso) => {
    const [y, m, d] = iso.split("-")
    return `${d}/${m}/${y}`
}

// "2026-09" -> "sept. 26"
export const formatMonthShort = (ym) => {
    const [y, m] = ym.split("-")
    return new Date(+y, +m - 1, 1).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
}

// "2026-09" -> "septembre 2026"
export const formatMonthLong = (ym) => {
    const [y, m] = ym.split("-")
    return new Date(+y, +m - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}