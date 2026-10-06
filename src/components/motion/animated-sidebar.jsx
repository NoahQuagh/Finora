import * as React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const SidebarContext = React.createContext(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within an AnimatedSidebarProvider.");
    }
    return context;
}

export const AnimatedSidebarProvider = React.forwardRef(
    ({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
        const [_open, _setOpen] = React.useState(defaultOpen);
        const open = openProp ?? _open;

        const setOpen = React.useCallback(
            (value) => {
                const openState = typeof value === "function" ? value(open) : value;
                if (setOpenProp) {
                    setOpenProp(openState);
                } else {
                    _setOpen(openState);
                }
            },
            [setOpenProp, open]
        );

        const toggleSidebar = React.useCallback(() => {
            setOpen((prev) => !prev);
        }, [setOpen]);

        const state = open ? "expanded" : "collapsed";

        const contextValue = React.useMemo(
            () => ({ state, open, setOpen, toggleSidebar }),
            [state, open, setOpen, toggleSidebar]
        );

        return (
            <SidebarContext.Provider value={contextValue}>
                <div
                    ref={ref}
                    style={{
                        "--sidebar-width": "16rem",
                        "--sidebar-width-icon": "4rem",
                        ...style,
                    }}
                    className={cn("flex min-h-screen w-full", className)}
                    {...props}
                >
                    {children}
                </div>
            </SidebarContext.Provider>
        );
    }
);
AnimatedSidebarProvider.displayName = "AnimatedSidebarProvider";

export const AnimatedSidebar = React.forwardRef(
    ({ collapsible = "icon", className, panelClassName, children, ariaLabel, ...props }, ref) => {
        const { state } = useSidebar();
        const isCollapsed = state === "collapsed";

        return (
            <motion.aside
                ref={ref}
                data-state={state}
                data-collapsible={isCollapsed ? collapsible : ""}
                aria-label={ariaLabel}
                animate={{ width: isCollapsed ? "4rem" : "16rem" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                    "group/sidebar relative flex flex-col shrink-0 border-r border-[var(--color-main-quaternary)] h-screen sticky top-0 z-40 overflow-hidden",
                    className
                )}
                {...props}
            >
                <div className={cn("flex h-full w-full flex-col overflow-y-auto overflow-x-hidden", panelClassName)}>
                    {children}
                </div>
            </motion.aside>
        );
    }
);
AnimatedSidebar.displayName = "AnimatedSidebar";

export const AnimatedSidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-14 items-center justify-between px-3 shrink-0", className)} {...props} />
));
AnimatedSidebarHeader.displayName = "AnimatedSidebarHeader";

export const AnimatedSidebarContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto overflow-x-hidden py-2", className)} {...props} />
));
AnimatedSidebarContent.displayName = "AnimatedSidebarContent";

export const AnimatedSidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-2 mt-auto shrink-0", className)} {...props} />
));
AnimatedSidebarFooter.displayName = "AnimatedSidebarFooter";

export const AnimatedSidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex w-full min-w-0 flex-col px-2 py-1", className)} {...props} />
));
AnimatedSidebarGroup.displayName = "AnimatedSidebarGroup";

export const AnimatedSidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-7 shrink-0 items-center px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider", className)} {...props} />
));
AnimatedSidebarGroupLabel.displayName = "AnimatedSidebarGroupLabel";

export const AnimatedSidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full text-sm", className)} {...props} />
));
AnimatedSidebarGroupContent.displayName = "AnimatedSidebarGroupContent";

export const AnimatedSidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
));
AnimatedSidebarMenu.displayName = "AnimatedSidebarMenu";

export const AnimatedSidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("group/menu-item relative list-none", className)} {...props} />
));
AnimatedSidebarMenuItem.displayName = "AnimatedSidebarMenuItem";

export const AnimatedSidebarMenuButton = React.forwardRef(({ icon, badge, children, className, onSelect, ...props }, ref) => (
    <button
        ref={ref}
        onClick={onSelect}
        className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-main-tertiary)] text-[var(--color-second-tertiary)] hover:text-[var(--color-second-primary)]",
            className
        )}
        {...props}
    >
        <span className="text-lg shrink-0">{icon}</span>
        <span className="truncate group-data-[state=collapsed]/sidebar:hidden">{children}</span>
        {badge}
    </button>
));
AnimatedSidebarMenuButton.displayName = "AnimatedSidebarMenuButton";

export const AnimatedSidebarClose = React.forwardRef(({ className, onClick, children, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    return (
        <button
            ref={ref}
            onClick={(e) => {
                onClick?.(e);
                toggleSidebar();
            }}
            className={cn("flex size-7 items-center justify-center rounded-md transition-colors hover:bg-[var(--color-main-tertiary)] text-[var(--color-second-tertiary)]", className)}
            {...props}
        >
            {children || <X className="size-4" />}
        </button>
    );
});
AnimatedSidebarClose.displayName = "AnimatedSidebarClose";

export const AnimatedSidebarRail = () => null;

export const AnimatedSidebarInset = React.forwardRef(({ className, children, ...props }, ref) => (
    <main ref={ref} className={cn(" overflow-x-hidden bg-[var(--color-main-primary)]", className)} {...props}>
        {children}
    </main>
));
AnimatedSidebarInset.displayName = "AnimatedSidebarInset";