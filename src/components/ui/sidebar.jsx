import * as React from "react"
import { PanelLeft } from "lucide-react"

const SidebarContext = React.createContext({
    open: true,
    setOpen: () => {},
})

export function SidebarProvider({ children, defaultOpen = true }) {
    const [open, setOpen] = React.useState(defaultOpen)

    return (
        <SidebarContext.Provider value={{ open, setOpen }}>
            <div className="flex min-h-screen w-full bg-background text-foreground">
                {children}
            </div>
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    return React.useContext(SidebarContext)
}

export function SidebarTrigger({ className = "", ...props }) {
    const { open, setOpen } = useSidebar()

    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-transparent text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors ${className}`}
            {...props}
        >
            <PanelLeft className="size-4" />
            <span className="sr-only">Basculer la barre latérale</span>
        </button>
    )
}

export function SidebarInset({ className = "", children, ...props }) {
    return (
        <div className={`flex flex-1 flex-col overflow-hidden ${className}`} {...props}>
            {children}
        </div>
    )
}

export function Sidebar({ className = "", children, collapsible = "icon", ...props }) {
    const { open } = useSidebar()

    return (
        <aside
            className={`flex flex-col border-r border-white/10 bg-card transition-all duration-300 ${
                open ? "w-64" : "w-16"
            } ${className}`}
            {...props}
        >
            {children}
        </aside>
    )
}

export function SidebarHeader({ className = "", ...props }) {
    return <div className={`flex flex-col p-3 ${className}`} {...props} />
}

export function SidebarContent({ className = "", ...props }) {
    return <div className={`flex-1 overflow-auto p-3 ${className}`} {...props} />
}

export function SidebarFooter({ className = "", ...props }) {
    return <div className={`flex flex-col p-3 border-t border-white/10 ${className}`} {...props} />
}

export function SidebarGroup({ className = "", ...props }) {
    return <div className={`flex flex-col gap-1 ${className}`} {...props} />
}

export function SidebarGroupLabel({ className = "", ...props }) {
    const { open } = useSidebar()
    if (!open) return null

    return (
        <div className={`px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${className}`} {...props} />
    )
}

export function SidebarGroupContent({ className = "", ...props }) {
    return <div className={`flex flex-col ${className}`} {...props} />
}

export function SidebarMenu({ className = "", ...props }) {
    return <ul className={`flex flex-col gap-1 ${className}`} {...props} />
}

export function SidebarMenuItem({ className = "", ...props }) {
    return <li className={`relative ${className}`} {...props} />
}

export function SidebarMenuButton({
                                      className = "",
                                      isActive = false,
                                      size = "default",
                                      tooltip,
                                      children,
                                      ...props
                                  }) {
    const { open } = useSidebar()

    const sizes = {
        default: "h-9 px-3 text-sm",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-3 text-sm",
    }

    return (
        <button
            type="button"
            className={`flex w-full items-center gap-3 rounded-xl font-medium transition-colors ${
                isActive
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            } ${sizes[size] || sizes.default} ${!open ? "justify-center px-0" : ""} ${className}`}
            title={!open ? tooltip : undefined}
            {...props}
        >
            {children}
        </button>
    )
}

export function SidebarRail() {
    return null
}