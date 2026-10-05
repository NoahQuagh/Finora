import * as React from "react"

const DropdownContext = React.createContext({
    open: false,
    setOpen: () => {},
})

export function DropdownMenu({ children }) {
    const [open, setOpen] = React.useState(false)
    const menuRef = React.useRef(null)

    React.useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <DropdownContext.Provider value={{ open, setOpen }}>
            <div ref={menuRef} className="relative inline-block text-left w-full">
                {children}
            </div>
        </DropdownContext.Provider>
    )
}

export function DropdownMenuTrigger({ asChild, children, ...props }) {
    const { open, setOpen } = React.useContext(DropdownContext)

    const handleClick = (e) => {
        e.stopPropagation()
        setOpen(!open)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: handleClick,
            ...props,
        })
    }

    return (
        <button type="button" onClick={handleClick} {...props}>
            {children}
        </button>
    )
}

export function DropdownMenuContent({ className = "", align = "start", side = "bottom", children, ...props }) {
    const { open } = React.useContext(DropdownContext)
    if (!open) return null

    const alignments = {
        start: "left-0",
        end: "right-0",
        center: "left-1/2 -translate-x-1/2",
    }

    const positions = {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
    }

    return (
        <div
            className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-card p-1 shadow-xl backdrop-blur-md text-foreground ${alignments[align] || "left-0"} ${positions[side] || "top-full mt-2"} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export function DropdownMenuItem({ className = "", children, onClick, ...props }) {
    const { setOpen } = React.useContext(DropdownContext)

    return (
        <button
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-white/10 ${className}`}
            onClick={(e) => {
                if (onClick) onClick(e)
                setOpen(false)
            }}
            {...props}
        >
            {children}
        </button>
    )
}

export function DropdownMenuLabel({ className = "", children, ...props }) {
    return (
        <div className={`px-2.5 py-1.5 text-xs font-semibold text-muted-foreground ${className}`} {...props}>
            {children}
        </div>
    )
}

export function DropdownMenuSeparator({ className = "", ...props }) {
    return <div className={`-mx-1 my-1 h-px bg-white/10 ${className}`} {...props} />
}