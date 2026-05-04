import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";

// Common Pages
import Login from "./pages/common/Login.jsx";
import Register from "./pages/common/Register.jsx";
import Home from "./pages/common/Home.jsx";

// Admin Layout & Pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminMainContent from "./components/admin/AdminMainContent.jsx";
import AddAgent from "./components/admin/AddAgent.jsx";
import Customers from "./components/admin/Customers.jsx";
import Tickets from "./components/admin/Tickets.jsx";
import FAQ from "./components/admin/FAQ.jsx";
import Docs from "./components/admin/Docs.jsx";

// Agent Layout & Pages
import AgentLayout from "./pages/agent/AgentLayout.jsx";
import AgentDashboard from "./pages/agent/AgentDashboard.jsx";
import AgentChat from "./pages/agent/AgentChat.jsx";
import AgentTicketHistory from "./pages/agent/AgentTicketHistory.jsx";
import AgentKnowledgeBase from "./pages/agent/AgentKnowledgeBase.jsx";
import AgentDocs from "./pages/agent/AgentDocs.jsx";
import AgentSettings from "./pages/agent/AgentSettings.jsx";

// Customer Layout & Pages
import CustomerLayout from "./pages/customer/CustomerLayout.jsx";
import CustomerChat from "./pages/customer/CustomerChat.jsx";

import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authSlice.js";

const App = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { token, user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && !user) {
            dispatch(fetchCurrentUser());
        }
    }, [token, user, dispatch]);

    useEffect(() => {
        // Disable Lenis smooth scrolling on dashboard routes so native nested scrolling works
        const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/agent') || location.pathname.startsWith('/customer');
        
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

    if (loading && token && !user) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0B1114]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#04B8FF]"></div>
            </div>
        );
    }

    return (
        <div>
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
                    <Route path="settings" element={<div style={{padding: '40px'}}><h2>Settings</h2><p>Coming soon...</p></div>} />
                </Route>

                {/* Agent Routes */}
                <Route path="/agent" element={<AgentLayout />}>
                    <Route index element={<AgentDashboard />} />
                    <Route path="chat" element={<AgentChat />} />
                    <Route path="tickets" element={<AgentTicketHistory />} />
                    <Route path="knowledge-base" element={<AgentKnowledgeBase />} />
                    <Route path="docs" element={<AgentDocs />} />
                    <Route path="settings" element={<AgentSettings />} />
                </Route>

                {/* Customer Routes */}
                <Route path="/customer" element={<CustomerLayout />}>
                    <Route path="chat" element={<CustomerChat />} />
                </Route>
            </Routes>
        </div>
    );
};

export default App;

