import React from "react";
import { Bell, Search, Settings, Menu } from "lucide-react";

const AdminTopBar = ({ setSidebarOpen, sidebarOpen }) => {
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
          <p style={{ fontSize: "12px", color: "#5a7a8a", margin: 0 }}>
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
        <div
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
          AD
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
