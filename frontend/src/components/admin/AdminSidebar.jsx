import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Download,
  Ticket,
  BookOpen,
  Settings,
  FileText,
  Zap,
  HelpCircle,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", Icon: LayoutDashboard, id: "dashboard" },
  { label: "Agents", Icon: UserPlus, id: "add-agent" },
  { label: "Customers", Icon: Users, id: "customers" },
  { label: "Tickets", Icon: Ticket, id: "tickets" },
  { label: "FAQ", Icon: BookOpen, id: "knowledge-base" },
  { label: "Docs", Icon: FileText, id: "docs" },
  { label: "Settings", Icon: Settings, id: "settings" },
];

const AdminSidebar = ({ active, setActive, sidebarOpen }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (showPopup) {
      // Start exit animation slightly before it unmounts
      const closeTimer = setTimeout(() => setIsClosing(true), 2700);
      const unmountTimer = setTimeout(() => {
        setShowPopup(false);
        setIsClosing(false); // reset for next time
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
        {navItems.map(({ label, Icon, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => {
                if (id === "settings") {
                  setShowPopup(true);
                } else {
                  setActive(id);
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

      {/* Quick Onboarding card */}
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
            Quick Onboarding
          </p>
          <p style={{ fontSize: "11px", opacity: 0.8, margin: "0 0 12px" }}>
            Add your first support staff member.
          </p>
          <button
            onClick={() => setActive("add-agent")}
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
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Custom Popup */}
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

export default AdminSidebar;
