import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopBar from "../../components/admin/AdminTopBar";
import AdminMainContent from "../../components/admin/AdminMainContent";
import AddAgent from "../../components/admin/AddAgent";
import Tickets from "../../components/admin/Tickets";
import FAQ from "../../components/admin/FAQ";
import Docs from "../../components/admin/Docs";
import Settings from "../../components/admin/Settings";
import Customers from "../../components/admin/Customers";

const AdminDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <AdminMainContent />;
      case "customers": return <Customers />;
      case "add-agent": return <AddAgent />;
      case "tickets": return <Tickets />;
      case "knowledge-base": return <FAQ />;
      case "docs": return <Docs />;
      case "settings": return <Settings />;
      default: return <AdminMainContent />;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        background: "#f0f7ff",
      }}
    >
      {/* ── Sidebar ── */}
      <AdminSidebar active={active} setActive={setActive} sidebarOpen={sidebarOpen} />

      {/* ── Main content wrapper ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        {/* Top bar */}
        <AdminTopBar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        {/* Scrollable body */}
        <main data-lenis-prevent style={{ flex: 1, overflowY: "auto" }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
