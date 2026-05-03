import React, { useEffect } from "react";
import { Route, Routes } from "react-router";
import Lenis from "lenis";
import Login from "./pages/common/Login.jsx";
import Register from "./pages/common/Register.jsx";
import Home from "./pages/common/Home.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AgentDashboard from "./pages/agent/AgentDashboard.jsx";

const App = () => {
    useEffect(() => {
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
    }, []);

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Agent Routes */}
                <Route path="/agent" element={<AgentDashboard />} />
            </Routes>
        </div>
    );
};

export default App;

