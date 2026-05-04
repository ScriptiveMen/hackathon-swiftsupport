import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Ticket, MessageSquare, Users, BarChart2, TrendingUp, TrendingDown, Minus, ChevronDown, CheckCircle2, AlertCircle
} from "lucide-react";
import { fetchAllTickets, assignTicketToAgent } from "../../store/slices/ticketSlice";
import { getAllChats } from "../../store/slices/chatSlice";

const DeltaBadge = ({ delta, up }) => {
  if (up === null)
    return (
      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: "#0072c6" }}>
        <Minus size={12} /> {delta}
      </span>
    );
  return up ? (
    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: "#10b981" }}>
      <TrendingUp size={12} /> {delta}
    </span>
  ) : (
    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: "#ef4444" }}>
      <TrendingDown size={12} /> {delta}
    </span>
  );
};

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading: ticketsLoading } = useSelector((state) => state.tickets);
  const { chats, loading: chatsLoading } = useSelector((state) => state.chat);
  const [grantingId, setGrantingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTickets());
    dispatch(getAllChats());
  }, [dispatch]);

  // Derive stats from live data
  const totalTickets = tickets?.length || 0;
  const resolvedTickets = tickets?.filter(t => t.status === "resolved" || t.status === "closed").length || 0;
  const openEscalations = tickets?.filter(t => !t.assignedTo && t.status === "open") || [];
  
  const stats = [
    { label: "Chats Handled",    value: chats?.length || 0, delta: "Live", up: true,  Icon: MessageSquare },
    { label: "Tickets Resolved", value: resolvedTickets,    delta: "Live", up: true,  Icon: CheckCircle2 },
    { label: "Total Tickets",    value: totalTickets,       delta: "Live", up: null,  Icon: Ticket },
    { label: "Avg. Response",    value: "--",               delta: "N/A",  up: null,  Icon: BarChart2 },
  ];

  const handleGrantRequest = async (ticket) => {
    setGrantingId(ticket._id);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await dispatch(assignTicketToAgent({ id: ticket._id, agentId: user.id })).unwrap();
      navigate("/dashboard/chat", { state: { chatId: ticket.chatId } });
    } catch (error) {
      console.error("Failed to grant request:", error);
    } finally {
      setGrantingId(null);
    }
  };

  return (
    <main data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

      {/* Incoming Escalations (NEW) */}
      {openEscalations.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "20px",
            boxShadow: "0 2px 12px rgba(239,68,68,0.15)",
            border: "1px solid #fee2e2"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <AlertCircle color="#ef4444" size={20} />
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#111827" }}>
              Incoming Escalations ({openEscalations.length})
            </h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {openEscalations.map((ticket) => (
              <div key={ticket._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fef2f2", padding: "16px", borderRadius: "12px" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#991b1b" }}>{ticket.title}</h4>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#b91c1c" }}>{ticket.description}</p>
                </div>
                <button
                  onClick={() => handleGrantRequest(ticket)}
                  disabled={grantingId === ticket._id}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: grantingId === ticket._id ? "not-allowed" : "pointer",
                    opacity: grantingId === ticket._id ? 0.7 : 1,
                    transition: "all 0.2s"
                  }}
                >
                  {grantingId === ticket._id ? "Granting..." : "Grant Request"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {stats.map(({ label, value, delta, up, Icon }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "18px",
              boxShadow: "0 2px 12px rgba(4,114,198,0.08)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "#f0f7ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <Icon size={18} color="#0072c6" />
            </div>
            <p style={{ fontSize: "12px", color: "#5a7a8a", margin: "0 0 6px" }}>
              {label}
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#1a3a4a" }}>
                {value}
              </span>
              <DeltaBadge delta={delta} up={up} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        {/* Recent Chats - Live Data */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "18px",
            boxShadow: "0 2px 12px rgba(4,114,198,0.08)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#1a3a4a", margin: 0 }}>
              Recent Chats
            </h3>
            <span style={{ fontSize: "11px", color: "#5a7a8a" }}>{chats?.length || 0} Total</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {chatsLoading ? (
              <p style={{ fontSize: "12px", color: "#5a7a8a" }}>Loading chats...</p>
            ) : chats && chats.length > 0 ? (
              chats.slice(0, 5).map((chat, i) => (
                <div
                  key={chat._id || i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#f8fafc"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1a3a4a" }}>
                      Chat #{chat._id?.substring(0, 6)}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#5a7a8a" }}>
                      Status: <span style={{ textTransform: "capitalize", color: chat.status === "active" ? "#10b981" : "#5a7a8a" }}>{chat.status}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard/chat", { state: { chatId: chat._id } })}
                    style={{ background: "#f0f7ff", border: "none", color: "#0072c6", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                  >
                    View Chat
                  </button>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "12px", color: "#5a7a8a" }}>No recent chats found.</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default AgentDashboard;
