import React from "react"
import { ArrowLeftRight, ChevronsUpDown, LayoutDashboard, LogOut, Receipt, Settings, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback } from "./../ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./../ui/dropdown-menu"
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from "./../ui/sidebar"

export const NAV = [
    { id: "accueil", label: "Accueil", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "virements", label: "Virements", icon: ArrowLeftRight },
    { id: "stats", label: "Statistiques", icon: TrendingUp },
    { id: "reglages", label: "Réglages", icon: Settings },
]

const initials = (nom = "") =>
    nom.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?"

export function AppSidebar({ user, onLogout, view, onNavigate, ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex h-9 items-center px-2 text-base font-semibold tracking-tight">⌢ Finora</div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV.map(({ id, label, icon: Icon }) => (
                                <SidebarMenuItem key={id}>
                                    <SidebarMenuButton tooltip={label} isActive={view === id} onClick={() => onNavigate(id)}>
                                        <Icon />
                                        <span>{label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" tooltip={user?.nom || "Compte"}>
                                    <Avatar className="size-8 rounded-lg">
                                        <AvatarFallback className="rounded-lg">{initials(user?.nom)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user?.nom}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="text-sm font-medium">{user?.nom}</div>
                                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout} className="text-red-400 focus:text-red-400">
                                    <LogOut /> Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}