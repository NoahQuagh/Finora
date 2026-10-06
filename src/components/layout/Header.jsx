import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSidebar } from '../motion/animated-sidebar';
import { CustomAvatar } from "../ui/CustomAvatar.jsx";
import { MorphingSearch } from "@/components/motion/morphing-search.jsx";
import './../../assets/style/navigation/header.css';

export function Header({
                           title = "Together",
                           titleLink = "/",
                           searchPlaceholder = "Rechercher...",
                           onSearch,
                           searchItems = [],
                           actions = [],
                           user,
                           tabs,
                       }) {
    const { toggleSidebar } = useSidebar();
    const navigate = useNavigate();

    const CurrentUser = user?.name || "Invite";
    const CurrentAvatar = user?.avatarUrl || "";

    const handleSelectResult = (item) => {
        if (item.id === "dashboard") navigate("/home");
        if (item.id === "tasks") navigate("/transactions");
        if (item.id === "settings") navigate("/profile/settings");
    };

    return (
        <header className="w-full border-b border-[var(--color-second-six)] bg-[var(--color-main-secondary)]">
            <section className="flex items-center justify-between px-4 pb-2.5">
                <div className="flex items-center gap-3">
                    <button className="sb-close text-[var(--color-second-tertiary)] hover:text-white transition-colors" onClick={toggleSidebar} type="button">
                        <i className="ti ti-layout-sidebar text-xl" aria-hidden={true} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-64 max-w-xs">
                        <MorphingSearch
                            items={searchItems}
                            placeholder={searchPlaceholder}
                            onSelect={handleSelectResult}
                        />
                    </div>

                    {actions.map((action, idx) => (
                        <React.Fragment key={idx}>
                            {action.component}
                        </React.Fragment>
                    ))}

                    <Link to="/profile/settings" className="shrink-0">
                        <CustomAvatar
                            size="md"
                            variant="blue"
                            src={CurrentAvatar}
                            name={CurrentUser}
                        />
                    </Link>
                </div>
            </section>

            {tabs}
        </header>
    );
}