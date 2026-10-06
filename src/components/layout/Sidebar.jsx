import React from "react";
import { Link, NavLink } from "react-router-dom";
import { CustomAvatar } from "../ui/CustomAvatar";
import {
    AnimatedSidebar,
    AnimatedSidebarHeader,
    AnimatedSidebarContent,
    AnimatedSidebarGroup,
    AnimatedSidebarGroupLabel,
    AnimatedSidebarGroupContent,
    AnimatedSidebarMenu,
    AnimatedSidebarMenuItem,
    AnimatedSidebarFooter,
    AnimatedSidebarRail,
} from "../motion/animated-sidebar";
import './../../assets/style/navigation/sidebar.css';
import {AppLogo} from "@/components/ui/AppLogo.jsx";

const DEFAULT_USER = { id: 0, name: 'Invité Utilisateur', email: 'guest@together.com', avatarUrl: '' };

export function Sidebar({ title = "Together", sections = [], user: userProp }) {
    const currentUser = userProp || DEFAULT_USER;

    return (
        <AnimatedSidebar
            ariaLabel={title}
            collapsible="icon"
            className="sidebar-custom-wrapper"
            panelClassName="sidebar"
        >
            <AnimatedSidebarHeader className="sb-header mt-2 pl-3.5">
                <Link to="/" className="flex items-center w-full overflow-hidden">
                    <AppLogo title={title} />
                </Link>
            </AnimatedSidebarHeader>

            <AnimatedSidebarContent className="sb-content">
                {sections.map((section, idx) => (
                    <React.Fragment key={section.label || idx}>
                        {idx > 0 && <div className="sb-divider" />}
                        <AnimatedSidebarGroup className="sb-section">
                            {section.label && (
                                <AnimatedSidebarGroupLabel className="sb-label">
                                    <span className="group-data-[state=collapsed]/sidebar:hidden">
                                        {section.label}
                                    </span>
                                </AnimatedSidebarGroupLabel>
                            )}
                            <AnimatedSidebarGroupContent>
                                <AnimatedSidebarMenu>
                                    {section.items && section.items.map((item, itemIdx) => (
                                        <AnimatedSidebarMenuItem key={item.label || itemIdx}>
                                            {item.onClick ? (
                                                <button
                                                    type="button"
                                                    onClick={item.onClick}
                                                    className="sb-item w-full text-left"
                                                >
                                                    <i className={item.icon} aria-hidden="true" />
                                                    <span className="sb-item-text truncate group-data-[state=collapsed]/sidebar:hidden">
                                                        {item.label}
                                                    </span>
                                                </button>
                                            ) : (
                                                <NavLink
                                                    to={item.to || "#"}
                                                    className={({ isActive }) => `sb-item ${isActive ? 'active' : ''}`}
                                                >
                                                    <i className={item.icon} aria-hidden="true" />
                                                    <span className="sb-item-text truncate group-data-[state=collapsed]/sidebar:hidden">
                                                        {item.label}
                                                    </span>
                                                    {item.badge && (
                                                        <span className="sb-badge group-data-[state=collapsed]/sidebar:hidden">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </NavLink>
                                            )}
                                        </AnimatedSidebarMenuItem>
                                    ))}
                                </AnimatedSidebarMenu>
                            </AnimatedSidebarGroupContent>
                        </AnimatedSidebarGroup>
                    </React.Fragment>
                ))}
            </AnimatedSidebarContent>
            <AnimatedSidebarRail />
        </AnimatedSidebar>
    );
}