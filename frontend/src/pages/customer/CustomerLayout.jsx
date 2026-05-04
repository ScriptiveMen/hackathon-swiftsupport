import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Home, MessageSquare, User, LogOut, Zap } from "lucide-react";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name": "Guest", "organization": "Public User"}');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-[Inter,sans-serif]">
      {/* Navbar matching HomeNavbar style */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl mt-3 px-4">
          <div
            className="flex items-center justify-between px-5 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(4,184,255,0.18)",
              boxShadow: "0 4px 32px rgba(4,184,255,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
            }}
          >
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#04b8ff] to-[#0077cc] flex items-center justify-center shadow-lg shadow-blue-100">
                <Zap size={18} color="#fff" />
              </div>
              <span className="text-[17px] font-bold text-[#0a2a3a] tracking-tight" style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif" }}>
                SwiftSupport
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate("/")}
                className="text-[13.5px] font-semibold text-[#4a6070] hover:text-[#04b8ff] transition-colors flex items-center gap-2"
              >
                <Home size={16} /> Home
              </button>
              <button 
                className="text-[13.5px] font-bold text-[#04b8ff] flex items-center gap-2"
              >
                <MessageSquare size={16} /> Chat
              </button>
            </div>

            {/* Profile / Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-[#1a3a4a] leading-tight">{user.name}</p>
                <p className="text-[11px] font-medium text-[#9ab0be]">{user.organization || "Customer"}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#04b8ff] text-[13px] font-bold">
                {user.name ? user.name[0].toUpperCase() : "C"}
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 pt-24 pb-8 h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
