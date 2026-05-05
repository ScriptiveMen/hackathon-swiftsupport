import React, { useState } from "react";
import { Bell, Search, Settings, Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";

import axiosClient from "../../api/axiosClient.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminTopBar = ({ setSidebarOpen, sidebarOpen }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { socket } = useSocket();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!user.organizationName && localStorage.getItem("token")) {
        try {
          const { data } = await axiosClient.get(`${baseUrl}/api/auth/getUser`);
          if (data.status && data.data.organizationName) {
            const updatedUser = {
              ...user,
              organizationName: data.data.organizationName,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
        } catch (err) {
          console.error("Failed to fetch user for organization name:", err);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosClient.post(`${baseUrl}/api/auth/logout`);
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

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="admin-hamburger mobile-only"
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
              fontSize: "20px",
              fontWeight: 800,
              color: "#1a3a4a",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.4px",
            }}
          >
            {user.organizationName || "Overview"}
            {socket?.connected && (
              <span 
                style={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#16a34a",
                  background: "#f0fdf4",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  marginLeft: "8px",
                  verticalAlign: "middle",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              >
                <span style={{ width: 5, height: 5, background: "#16a34a", borderRadius: "50%" }} />
                Live
              </span>
            )}
          </h1>
          <p
            className="topbar-subtitle"
            style={{ fontSize: "12px", color: "#5a7a8a", margin: 0 }}
          >
            Welcome to Your Admin Dashboard
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
            padding: "7px 14px",
            border: "1px solid #dceefa",
          }}
        >
          <Search size={14} color="#5a7a8a" />
          <input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              color: "#1a3a4a",
              width: "140px",
            }}
          />
        </div>
        <button
          style={{
            border: "none",
            background: "#f0f7ff",
            borderRadius: "10px",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#5a7a8a",
            position: "relative",
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 7,
              width: 7,
              height: 7,
              background: "#ef4444",
              borderRadius: "50%",
              border: "1.5px solid #fff",
            }}
          />
        </button>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#04b8ff,#0072c6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {getInitials(user?.name)}
          </div>
          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: 0,
                width: "180px",
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
                  {user?.name}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#5a7a8a" }}>
                  {user?.email}
                </p>
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

export default AdminTopBar;
