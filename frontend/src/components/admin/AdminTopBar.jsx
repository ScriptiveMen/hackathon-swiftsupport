import React, { useState } from "react";
import { Bell, Search, Settings, Menu, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import { useNavigate } from "react-router-dom";

const AdminTopBar = ({ setSidebarOpen, sidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
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
          className="admin-hamburger"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#5a7a8a",
            display: "none",
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
            Overview
          </h1>
          <p className="topbar-subtitle" style={{ fontSize: "12px", color: "#5a7a8a", margin: 0 }}>
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
              <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f7ff", marginBottom: "4px" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#1a3a4a" }}>{user?.name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#5a7a8a" }}>{user?.email}</p>
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
                onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
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
