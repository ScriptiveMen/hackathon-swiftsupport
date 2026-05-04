import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, MessageSquare, BarChart2, TrendingUp, TrendingDown, Minus, CheckCircle2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/common/Loader.jsx";



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
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ticketRes = await axiosClient.get("/tickets/getAllTickets");
        setTickets(ticketRes.data.tickets || ticketRes.data.data || ticketRes.data);
        
        const chatRes = await axiosClient.get("/chat/getAllChats");
        setChats(chatRes.data.data || chatRes.data.chats || chatRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  // Derive stats from live data
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;

  const totalTickets = tickets?.length || 0;
  const resolvedTickets = tickets?.filter(t => t.status === "resolved" || t.status === "closed").length || 0;
  
  // Now filter escalations that are automatically assigned to THIS agent
  const myAssignedEscalations = tickets?.filter(t => 
    t.assignedTo === userId && 
    t.status === "open" &&
    t.title === "Chat Escalation"
  ) || [];
  
  const stats = [
    { label: "Chats Handled",    value: chats?.length || 0, delta: "Live", up: true,  Icon: MessageSquare },
    { label: "Tickets Resolved", value: resolvedTickets,    delta: "Live", up: true,  Icon: CheckCircle2 },
    { label: "Total Tickets",    value: totalTickets,       delta: "Live", up: null,  Icon: Ticket },
    { label: "Avg. Response",    value: "--",               delta: "N/A",  up: null,  Icon: BarChart2 },
  ];

  const handleJoinChat = (ticket) => {
    navigate("/agent/chat", { state: { chatId: ticket.chatId } });
  };

  return (
    <>
      {loading && <Loader />}
      <main data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {/* Auto-Assigned Escalations */}
        {myAssignedEscalations.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "20px",
              boxShadow: "0 4px 20px rgba(4,114,198,0.12)",
              border: "1px solid #e0f2fe",
              animation: "pulse 2s infinite"
            }}
          >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: 10, height: 10, background: "#0ea5e9", borderRadius: "50%" }}></div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#0369a1" }}>
              New Assigned Chats ({myAssignedEscalations.length})
            </h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myAssignedEscalations.map((ticket) => (
              <div key={ticket._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0f9ff", padding: "16px", borderRadius: "12px", border: "1px solid #bae6fd" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#0c4a6e" }}>{ticket.title}</h4>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#075985" }}>{ticket.description}</p>
                </div>
                <button
                  onClick={() => handleJoinChat(ticket)}
                  style={{
                    background: "#0ea5e9",
                    color: "white",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(14,165,233,0.3)",
                    transition: "all 0.2s"
                  }}
                >
                  Join Chat
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
            {loading ? (
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
                    onClick={() => navigate("/agent/chat", { state: { chatId: chat._id } })}
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
    </>
  );
};

export default AgentDashboard;
