import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  CheckCircle,
  Clock,
  Moon,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { useSearch } from "../../context/SearchContext.jsx";

const pageTitles = {
  "/agent": { title: "Overview", sub: "Welcome to Your Agent Portal" },
  "/agent/chat": {
    title: "Live Chat",
    sub: "Manage your active conversations",
  },
  "/agent/tickets": {
    title: "Tickets",
    sub: "View your assigned ticket history",
  },
  "/agent/faq": { title: "FAQ", sub: "Browse FAQs and support articles" },
  "/agent/docs": {
    title: "Documentation",
    sub: "Learn how to use the Agent Portal",
  },
  "/agent/settings": {
    title: "Settings",
    sub: "Manage your account preferences",
  },
};

const AgentTopBar = ({ setSidebarOpen, sidebarOpen }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { title, sub } = pageTitles[location.pathname] || {
    title: "Dashboard",
    sub: "Welcome to Your Agent Portal",
  };

  const [currentStatus, setCurrentStatus] = useState(
    user?.status || "Available",
  );

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/login");
      window.location.reload();
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { data } = await axiosClient.put("/auth/updateStatus", {
        status: newStatus,
      });
      if (data.status) {
        setCurrentStatus(newStatus);
        const updatedUser = { ...user, status: newStatus };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "#10b981";
      case "Busy":
        return "#f59e0b";
      case "Offline":
        return "#94a3b8";
      default:
        return "#10b981";
    }
  };

  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #e2eef8",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexShrink: 0,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mobile-only"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#5a7a8a",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#1a3a4a",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.4px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "11px",
              color: "#5a7a8a",
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {sub}
          </p>
        </div>
      </div>

      {/* Search + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f0f7ff",
            borderRadius: "10px",
            padding: "6px 12px",
            border: "1px solid #dceefa",
          }}
        >
          <Search size={14} color="#5a7a8a" />
          <input
            placeholder="Search..."
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "12px",
              color: "#1a3a4a",
              width: "120px",
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>

        <button
          style={{
            border: "none",
            background: "#f0f7ff",
            borderRadius: "10px",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#5a7a8a",
            position: "relative",
          }}
        >
          <Bell size={15} />
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 6,
              width: 6,
              height: 6,
              background: "#ef4444",
              borderRadius: "50%",
              border: "1.2px solid #fff",
            }}
          />
        </button>

        {/* Agent Avatar Dropdown */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#04b8ff,#0072c6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              position: "relative",
            }}
          >
            {getInitials(user?.name)}
            {/* Online/Status indicator dot */}
            <span
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "10px",
                height: "10px",
                background: getStatusColor(currentStatus),
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                width: "200px",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                border: "1px solid #e2eef8",
                padding: "8px",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #f0f7ff",
                  marginBottom: "4px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#1a3a4a",
                  }}
                >
                  {user?.name || "Agent"}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#5a7a8a" }}>
                  {user?.email || "agent@swiftsupport.com"}
                </p>
              </div>

              {/* Status Selection */}
              <div
                style={{
                  padding: "4px 0",
                  borderBottom: "1px solid #f0f7ff",
                  marginBottom: "4px",
                }}
              >
                {[
                  { label: "Available", color: "#10b981", icon: CheckCircle },
                  { label: "Busy", color: "#f59e0b", icon: Clock },
                  { label: "Offline", color: "#94a3b8", icon: Moon },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      updateStatus(s.label);
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background:
                        currentStatus === s.label ? "#f0f7ff" : "transparent",
                      color: currentStatus === s.label ? "#0072c6" : "#5a7a8a",
                      fontSize: "12px",
                      fontWeight: currentStatus === s.label ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (currentStatus !== s.label)
                        e.currentTarget.style.background = "#f8fbff";
                    }}
                    onMouseLeave={(e) => {
                      if (currentStatus !== s.label)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <s.icon size={14} color={s.color} />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "transparent",
                  color: "#ef4444",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fff5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AgentTopBar;
