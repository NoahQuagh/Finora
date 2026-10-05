import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import { LoginPage } from "./pages/LoginPage";
import { Home } from "./pages/HomePage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<Home />} />
                    </Route>

                    {/* Redirection par défaut vers /home */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}