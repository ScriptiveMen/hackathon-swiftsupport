import { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "react-hot-toast";
import axiosClient from "./api/axiosClient.js";

import Loader from "./components/common/Loader.jsx";
// Lazy load components for better performance (code splitting)
const Home = lazy(() => import("./pages/common/Home.jsx"));
const Login = lazy(() => import("./pages/common/Login.jsx"));
const Register = lazy(() => import("./pages/common/Register.jsx"));
const AdminLogin = lazy(() => import("./pages/common/AdminLogin.jsx"));
const CustomerChat = lazy(() => import("./pages/customer/CustomerChat.jsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AgentLayout = lazy(() => import("./pages/agent/AgentLayout.jsx"));
const AgentDashboard = lazy(() => import("./pages/agent/AgentDashboard.jsx"));
const AgentChat = lazy(() => import("./pages/agent/AgentChat.jsx"));
const AgentTicketHistory = lazy(() => import("./pages/agent/AgentTicketHistory.jsx"));
const AgentFAQ = lazy(() => import("./pages/agent/AgentFAQ.jsx"));
const AgentDocs = lazy(() => import("./pages/agent/AgentDocs.jsx"));
const AgentSettings = lazy(() => import("./pages/agent/AgentSettings.jsx"));
const FeaturesPage = lazy(() => import("./pages/common/Features.jsx"));
const PricingPage = lazy(() => import("./pages/common/Pricing.jsx"));
const HelpCenter = lazy(() => import("./pages/common/HelpCenter.jsx"));

import MainLayout from "./components/common/MainLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// Admin Components
const AdminMainContent = lazy(() => import("./components/admin/AdminMainContent.jsx"));
const AddAgent = lazy(() => import("./components/admin/AddAgent.jsx"));
const Customers = lazy(() => import("./components/admin/Customers.jsx"));
const Tickets = lazy(() => import("./components/admin/Tickets.jsx"));
const FAQ = lazy(() => import("./components/admin/FAQ.jsx"));
const Docs = lazy(() => import("./components/admin/Docs.jsx"));

const App = () => {
  const location = useLocation();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Heartbeat system
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const sendHeartbeat = async () => {
      try {
        await axiosClient.post("/auth/heartbeat");
      } catch (err) {
        console.error("Heartbeat error:", err);
      }
    };

    // Send immediately on mount if logged in
    sendHeartbeat();

    // Send every 5 minutes
    const interval = setInterval(sendHeartbeat, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location.pathname]); // Re-run or ensure it's active across routes

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
          console.error(
            "Session Verification Error:",
            err.response?.data || err.message,
          );
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
      location.pathname.startsWith("/chat");

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
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerChat /></ProtectedRoute>} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/docs" element={<HelpCenter />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminMainContent />} />
            <Route path="agents" element={<AddAgent />} />
            <Route path="customers" element={<Customers />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="docs" element={<Docs />} />
            <Route
              path="settings"
              element={
                <div style={{ padding: "40px" }}>
                  <h2>Settings</h2>
                  <p>Coming soon...</p>
                </div>
              }
            />
          </Route>

          {/* Agent Routes */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <AgentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AgentDashboard />} />
            <Route path="chat" element={<AgentChat />} />
            <Route path="tickets" element={<AgentTicketHistory />} />
            <Route path="faq" element={<AgentFAQ />} />
            <Route path="docs" element={<AgentDocs />} />
            <Route path="settings" element={<AgentSettings />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<Register />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
