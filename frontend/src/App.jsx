import { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import axiosClient from "./api/axiosClient.js";

import Loader from "./components/common/Loader.jsx";
import Home from "./pages/common/Home.jsx";
import Login from "./pages/common/Login.jsx";
import Register from "./pages/common/Register.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AgentDashboard from "./pages/agent/AgentDashboard.jsx";

// Admin Components
import AdminMainContent from "./components/admin/AdminMainContent.jsx";
import AddAgent from "./components/admin/AddAgent.jsx";
import Customers from "./components/admin/Customers.jsx";
import Tickets from "./components/admin/Tickets.jsx";
import FAQ from "./components/admin/FAQ.jsx";
import Docs from "./components/admin/Docs.jsx";

const App = () => {
    const location = useLocation();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Data Fetching
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsInitialLoading(false);
                return;
            }

            try {
                const { data } = await axiosClient.get("/auth/getUser");
                const userData = data.data || data.user || data;
                localStorage.setItem("user", JSON.stringify(userData));
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error("Session Verification Error:", err.response?.data || err.message);
                }
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } finally {
                setIsInitialLoading(false);
            }
        };
        verifySession();
    }, []);


    useEffect(() => {
        // Disable Lenis smooth scrolling on dashboard routes so native nested scrolling works
        const isDashboard =
            location.pathname.startsWith("/admin") ||
            location.pathname.startsWith("/agent") ||
            location.pathname.startsWith("/customer");

        if (isDashboard) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [location.pathname]);

    if (isInitialLoading) {
        return <Loader />;
    }

    return (
        <div>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-register" element={<Register />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminMainContent />} />
                        <Route path="agents" element={<AddAgent />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="tickets" element={<Tickets />} />
                        <Route path="faq" element={<FAQ />} />
                        <Route path="docs" element={<Docs />} />
                        <Route path="settings" element={<div style={{ padding: "40px" }}><h2>Settings</h2><p>Coming soon...</p></div>} />
                    </Route>

                    {/* Agent Routes */}
                    <Route path="/agent" element={<AgentDashboard />} />
                </Routes>
            </Suspense>
        </div>
    );
};

export default App;
