import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/Usedashboard";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { TransactionModal } from "../modals/TransactionModal";

import { AnimatedSidebarProvider, AnimatedSidebarInset } from "../motion/animated-sidebar";
import { BloomMenu } from "@/components/motion/bloom-menu.jsx";

export function MainLayout() {
    console.log("--> MainLayout est en train de s'exécuter !");
    const { user, logout } = useAuth();
    const { data, loading, isDemo, refetch } = useDashboard();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // 1. Éléments du BloomMenu
    const BLOOM_ITEMS = [
        { label: "Transaction", icon: "ti ti-plus" },
        { label: "Budget", icon: "ti ti-chart-pie" },
        { label: "Rapport", icon: "ti ti-report" },
    ];

    // 2. Sections de la Sidebar
    const sidebarSections = [
        {
            label: "GÉNÉRAL",
            items: [
                { to: "/home", label: "Tableau de bord", icon: "ti ti-layout-dashboard" },
                { to: "/transactions", label: "Transactions", icon: "ti ti-receipt-2" },
                { to: "/virement", label: "Virement", icon: "ti ti-arrows-left-right" },
            ],
        },
        {
            label: "ANALYSE",
            items: [
                { to: "/stats", label: "Statistiques", icon: "ti ti-chart-bar" },
                { to: "/document", label: "Documents", icon: "ti ti-file" },
            ],
        },
        {
            label: "COMPTE",
            items: [
                { to: "/profile/settings", label: "Paramètres", icon: "ti ti-settings-2" },
                { to: "/quicklinks/help", label: "Aide", icon: "ti ti-help" },
                { onClick: logout, label: "Déconnexion", icon: "ti ti-logout" },
            ],
        },
    ];

    // 3. Actions du Header (BloomMenu injecté ici)
    const headerActions = [
        {
            component: (
                <BloomMenu
                    key="bloom"
                    items={BLOOM_ITEMS}
                    label="Nouveau"
                    onSelect={(label) => {
                        if (label === "Transaction") {
                            handleOpenModal(1);
                        }
                    }}
                />
            ),
        },
    ];

    // 4. Éléments de la recherche globale (MorphingSearch)
    const searchItems = [
        {
            id: "dashboard",
            title: "Tableau de bord",
            description: "Vue d'ensemble des finances",
            keywords: ["accueil", "home", "stats"],
            icon: () => <i className="ti ti-layout-dashboard text-xl text-[var(--color-second-tertiary)]" />,
        },
        {
            id: "tasks",
            title: "Transactions",
            description: "Historique des opérations",
            keywords: ["virement", "dépense", "recette"],
            icon: () => <i className="ti ti-receipt-2 text-xl text-[var(--color-second-tertiary)]" />,
        },
        {
            id: "settings",
            title: "Paramètres",
            description: "Configuration du compte",
            keywords: ["profil", "options"],
            icon: () => <i className="ti ti-settings-2 text-xl text-[var(--color-second-tertiary)]" />,
        },
    ];

    const footerColumns = [
        {
            title: "Raccourcis rapides",
            links: [
                { to: "/dashboard", label: "Accueil" },
                { to: "/notifications", label: "Notifications" },
                { to: "/calendar", label: "Calendrier" },
                { to: "/stats", label: "Statistiques" },
                { to: "/reports", label: "Rapports" },
                { to: "/settings", label: "Paramètres" },
            ],
        },
        {
            title: "Liens utiles",
            links: [
                { to: "/help", label: "Aide" },
                { to: "/documentation", label: "Documentation" },
                { to: "/report-bug", label: "Signaler un bug" },
                { to: "/submit-idea", label: "Proposer une idée" },
            ],
        },
        {
            title: "Réseau",
            links: [
                { to: "/about", label: "À propos" },
                { to: "/faq", label: "FAQ" },
                { to: "/changelog", label: "Changelog" },
                { to: "https://github.com/NoahQuagh/Together", label: "GitHub", external: true },
                { to: "/status", label: "Statut" },
            ],
        },
    ];

    // 5. Gestion des modales et navigation
    const handleOpenModal = (initialStep = 1) => {
        setStep(initialStep);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const dataUser = {
        name: 'Invité Utilisateur',
            email:'guest@together.com',
            avatarUrl:''
    };


    if (loading || !data) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1b1e] text-white text-sm">
                Chargement de tes finances...
            </div>
        );
    }

    return (
        <AnimatedSidebarProvider defaultOpen={false}>
            <div className="flex min-h-screen w-full">

                <Sidebar sections={sidebarSections} user={dataUser} />

                <AnimatedSidebarInset className="flex flex-col flex-1 min-w-0">
                    <Header
                        title="Finora"
                        titleLink="/home"
                        searchPlaceholder="Rechercher..."
                        searchItems={searchItems}
                        actions={headerActions}
                        user={dataUser}
                    />

                    <main className="flex-1 w-full text-left p-4 md:p-6 bg-[var(--bg-body)]">
                        <Outlet context={{ data, refetch, user }} />
                    </main>

                    <Footer
                        columns={footerColumns}
                        brandName="Finora"
                        slogan="Gestion financière simplifiée."
                        version="1.0.0"
                    />
                </AnimatedSidebarInset>

                {/* Modale des transactions */}
                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    comptes={data?.comptes || []}
                    budgets={data?.budgets || []}
                    onRefresh={refetch}
                />
            </div>
        </AnimatedSidebarProvider>
    );
}