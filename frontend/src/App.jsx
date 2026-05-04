import { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import axiosClient from "./api/axiosClient.js";


import Loader from "./components/common/Loader.jsx";

// ── Eagerly loaded (landing page — needs fast first paint) ──────────
import Home from "./pages/common/Home.jsx";

// ── Lazy loaded (code-split per route) ─────────────────────────────
const Login            = lazy(() => import("./pages/common/Login.jsx"));
const Register         = lazy(() => import("./pages/common/Register.jsx"));

// Admin
const AdminLayout      = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminMainContent = lazy(() => import("./components/admin/AdminMainContent.jsx"));
const AddAgent         = lazy(() => import("./components/admin/AddAgent.jsx"));
const Customers        = lazy(() => import("./components/admin/Customers.jsx"));
const Tickets          = lazy(() => import("./components/admin/Tickets.jsx"));
const FAQ              = lazy(() => import("./components/admin/FAQ.jsx"));
const Docs             = lazy(() => import("./components/admin/Docs.jsx"));

// Agent
const AgentLayout        = lazy(() => import("./pages/agent/AgentLayout.jsx"));
const AgentDashboard     = lazy(() => import("./pages/agent/AgentDashboard.jsx"));
const AgentChat          = lazy(() => import("./pages/agent/AgentChat.jsx"));
const AgentTicketHistory = lazy(() => import("./pages/agent/AgentTicketHistory.jsx"));
const AgentKnowledgeBase = lazy(() => import("./pages/agent/AgentKnowledgeBase.jsx"));
const AgentFAQ           = lazy(() => import("./pages/agent/AgentFAQ.jsx"));
const AgentDocs          = lazy(() => import("./pages/agent/AgentDocs.jsx"));
const AgentSettings      = lazy(() => import("./pages/agent/AgentSettings.jsx"));

// Customer
const CustomerLayout = lazy(() => import("./pages/customer/CustomerLayout.jsx"));
const CustomerChat   = lazy(() => import("./pages/customer/CustomerChat.jsx"));

// ── Shared fallback spinner ─────────────────────────────────────────
const PageLoader = () => (
    <div className="h-screen w-full flex items-center justify-center bg-[#f4f7fb]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1f88d9]" />
    </div>
);

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
            <Suspense fallback={<PageLoader />}>
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
                    <Route path="/agent" element={<AgentLayout />}>
                        <Route index element={<AgentDashboard />} />
                        <Route path="chat" element={<AgentChat />} />
                        <Route path="tickets" element={<AgentTicketHistory />} />
                        <Route path="knowledge-base" element={<AgentKnowledgeBase />} />
                        <Route path="faq" element={<AgentFAQ />} />
                        <Route path="docs" element={<AgentDocs />} />
                        <Route path="settings" element={<AgentSettings />} />
                    </Route>

                    {/* Customer Routes */}
                    <Route path="/customer" element={<CustomerLayout />}>
                        <Route path="chat" element={<CustomerChat />} />
                    </Route>
                </Routes>
            </Suspense>
        </div>
    );
};

export default App;
