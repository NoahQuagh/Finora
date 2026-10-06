import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import { LoginPage } from "./pages/LoginPage";
import { Home } from "./pages/HomePage";
import {TransactionPage} from "@/pages/TransactionPage.jsx";
import {MainLayout} from "@/components/layout/MainLayout.jsx";

export default function App() {
    return (
        <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/transactions" element={<TransactionPage />} />
                        </Route>
                    </Route>

                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
        </AuthProvider>
    );
}