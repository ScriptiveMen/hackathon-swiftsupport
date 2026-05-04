import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Ticket,
  BookOpen,
  Settings,
  FileText,
  Zap,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",      Icon: LayoutDashboard, path: "/agent" },
  { label: "Live Chat",      Icon: MessageSquare,   path: "/agent/chat" },
  { label: "Tickets",        Icon: Ticket,          path: "/agent/tickets" },
  { label: "Knowledge Base", Icon: BookOpen,        path: "/agent/knowledge-base" },
  { label: "Docs",           Icon: FileText,        path: "/agent/docs" },
  { label: "Settings",       Icon: Settings,        path: "settings" },
];

const AgentSidebar = ({ sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const closeTimer  = setTimeout(() => setIsClosing(true), 2700);
      const unmountTimer = setTimeout(() => {
        setShowPopup(false);
        setIsClosing(false);
      }, 3000);
      return () => {
        clearTimeout(closeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [showPopup]);

  return (
    <aside
      style={{
        width: sidebarOpen ? "220px" : "0px",
        minWidth: sidebarOpen ? "220px" : "0px",
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "#fff",
        borderRight: "1px solid #e2eef8",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        overflow: "hidden",
        zIndex: 10,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Logo — same 64px height as top header so borders align */}
      <div
        style={{
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid #e2eef8",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg,#04b8ff,#0072c6)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={18} color="#fff" />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "#1a3a4a",
            letterSpacing: "-0.3px",
            whiteSpace: "nowrap",
          }}
        >
          SwiftSupport
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "16px 10px" }}>
        {navItems.map(({ label, Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={label}
              onClick={() => {
                if (path === "settings") {
                  setShowPopup(true);
                } else {
                  navigate(path, { replace: true });
                }
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                background: isActive
                  ? "linear-gradient(90deg,#e8f4fd,#d0eaf9)"
                  : "transparent",
                color: isActive ? "#0072c6" : "#5a7a8a",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13.5px",
                cursor: "pointer",
                marginBottom: "2px",
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#f0f7ff";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={17} />
              <span style={{ whiteSpace: "nowrap" }}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Help card — same as Admin's Quick Onboarding card */}
      <div style={{ padding: "12px" }}>
        <div
          style={{
            background: "linear-gradient(135deg,#3b9edd,#0072c6)",
            borderRadius: "14px",
            padding: "16px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
            }}
          >
            <HelpCircle size={22} color="#fff" />
          </div>
          <p style={{ fontWeight: 700, fontSize: "13px", margin: "0 0 4px" }}>
            Need Help?
          </p>
          <p style={{ fontSize: "11px", opacity: 0.8, margin: "0 0 12px" }}>
            View docs or contact admin support.
          </p>
          <button
            onClick={() => navigate("/agent/docs", { replace: true })}
            style={{
              background: "#fff",
              color: "#0072c6",
              border: "none",
              borderRadius: "8px",
              padding: "7px 18px",
              fontWeight: 700,
              fontSize: "12px",
              cursor: "pointer",
              width: "100%",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            View Docs
          </button>
        </div>
      </div>

      {/* Settings Popup — identical to Admin */}
      {showPopup && (
        <div
          className={isClosing ? "animate-popup-out" : "animate-popup-in"}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px 30px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #e2eef8",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#fffbeb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings size={20} color="#f59e0b" />
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "16px", color: "#1a3a4a" }}>
            Coming Soon!
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#5a7a8a" }}>
            This feature is currently under production.
          </p>
        </div>
      )}
    </aside>
  );
};

export default AgentSidebar;
