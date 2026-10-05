import * as React from "react"

export const Avatar = React.forwardRef(({ className = "", children, ...props }, ref) => (
    <div
        ref={ref}
        className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
        {...props}
    >
        {children}
    </div>
))
Avatar.displayName = "Avatar"

export const AvatarFallback = React.forwardRef(({ className = "", children, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex h-full w-full items-center justify-center rounded-full bg-white/10 font-semibold text-white ${className}`}
        {...props}
    >
        {children}
    </div>
))
AvatarFallback.displayName = "AvatarFallback"