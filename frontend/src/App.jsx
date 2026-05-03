import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AgentLayout from "./layout/AgentLayout";

// Pages
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentChat from "./pages/agent/AgentChat";
import AgentTicketHistory from "./pages/agent/AgentTicketHistory";
import AgentFAQ from "./pages/agent/AgentFAQ";
import AgentSettings from "./pages/agent/AgentSettings";
import AgentDocs from "./pages/agent/AgentDocs";

function App() {
  return (
    <Routes>
      {/* Redirect root to /agent for now, assuming agent is the main focus */}
      <Route path="/" element={<Navigate to="/agent" replace />} />

      {/* Agent Routes wrapped in AgentLayout */}
      <Route path="/agent" element={<AgentLayout />}>
        <Route index element={<AgentDashboard />} />
        <Route path="chat" element={<AgentChat />} />
        <Route path="tickets" element={<AgentTicketHistory />} />
        <Route path="faq" element={<AgentFAQ />} />
        <Route path="settings" element={<AgentSettings />} />
        <Route path="docs" element={<AgentDocs />} />
      </Route>
    </Routes>
  );
}

export default App;