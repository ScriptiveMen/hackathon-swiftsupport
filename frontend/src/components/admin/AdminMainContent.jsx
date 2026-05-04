import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  Ticket, MessageSquare, Users, TrendingUp, TrendingDown, Minus,
} from "lucide-react";

const DeltaBadge = ({ delta, up }) => {
  if (up === null)
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-blue-500">
        <Minus size={12} /> {delta}
      </span>
    );
  return up ? (
    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
      <TrendingUp size={12} /> {delta}
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs font-semibold text-rose-500">
      <TrendingDown size={12} /> {delta}
    </span>
  );
};

const AdminMainContent = () => {
  const [tickets, setTickets] = useState([]);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketRes = await axiosClient.get("/tickets/getAllTickets");
        setTickets(ticketRes.data.tickets || ticketRes.data.data || ticketRes.data);

        const chatRes = await axiosClient.get("/chat/all");
        setChats(chatRes.data.chats || chatRes.data.data || chatRes.data);

        const userRes = await axiosClient.get("/auth/users");
        setUsers(userRes.data.users || userRes.data.data || userRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    fetchData();
  }, []);


  const totalAgents = users?.filter(u => u.role === "agent").length || 0;
  const totalCustomers = users?.filter(u => u.role === "customer").length || 0;
  const totalTickets = tickets?.length || 0;
  const totalChats = chats?.length || 0;

  const stats = [
    { label: "Total AI Agents",    value: totalAgents, delta: "Live", up: true,  Icon: Users },
    { label: "Total Customers",    value: totalCustomers, delta: "Live", up: true,  Icon: Users },
    { label: "Total Tickets",      value: totalTickets, delta: "Live",  up: true, Icon: Ticket },
    { label: "Messages Handled",   value: totalChats, delta: "Live", up: true,  Icon: MessageSquare },
  ];

  return (
    <main data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
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
              <span
                style={{ fontSize: "22px", fontWeight: 700, color: "#1a3a4a" }}
              >
                {value}
              </span>
              <DeltaBadge delta={delta} up={up} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        {/* Recent User Inquiries */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "18px",
            boxShadow: "0 2px 12px rgba(4,114,198,0.08)",
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
              Recent Tickets & Escalations
            </h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tickets && tickets.length > 0 ? (
              tickets.slice(0, 5).map(ticket => (
                 <div key={ticket._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "10px", background: "#f8fafc" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1a3a4a" }}>{ticket.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#5a7a8a" }}>Status: {ticket.status}</p>
                  </div>
                 </div>
              ))
            ) : (
              <p style={{ fontSize: "12px", color: "#5a7a8a" }}>No tickets found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMainContent;
