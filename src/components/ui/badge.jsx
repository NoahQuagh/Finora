import * as React from "react"

export function Badge({ className = "", variant = "default", ...props }) {
    const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none"
    const variants = {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-white/10 text-white",
        outline: "text-foreground border-white/10",
    }
    return <div className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />
}