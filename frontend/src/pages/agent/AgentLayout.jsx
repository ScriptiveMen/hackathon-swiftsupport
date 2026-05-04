import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AgentSidebar from "../../components/agent/AgentSidebar";
import AgentTopBar from "../../components/agent/AgentTopBar";

const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    // Call once on mount to handle initial load correctly
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", background: "#f0f7ff", overflow: "hidden", fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#1a3a4a" }}>
      <AgentSidebar sidebarOpen={sidebarOpen} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <AgentTopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div style={{ flex: 1, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;
