import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/common/Login.jsx";
import Register from "./pages/common/Register.jsx";
import Home from "./pages/common/Home.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AgentDashboard from "./pages/agent/AgentDashboard.jsx";

const App = () => {
    return (
        <div className="px-10">
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
