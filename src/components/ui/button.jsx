import * as React from "react"
import { Loader2 } from "lucide-react"

export const Button = React.forwardRef(({ className = "", variant = "default", size = "default", loading = false, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

    const variants = {
        default: "bg-white text-black hover:bg-gray-200 shadow",
        primary: "bg-white text-black hover:bg-gray-200 shadow",
        outline: "border border-white/10 bg-transparent hover:bg-white/10 text-white",
        ghost: "hover:bg-white/10 text-white",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-9 w-9",
    }

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            {children}
        </button>
    )
})
Button.displayName = "Button"