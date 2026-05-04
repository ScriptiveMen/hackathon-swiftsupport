import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, MessageSquare, BarChart2, TrendingUp, TrendingDown, Minus, CheckCircle2, ArrowUpRight, Clock, AlertCircle, Star } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/common/Loader.jsx";
import { useSocket } from "../../context/SocketContext.jsx";

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

  const { socket } = useSocket();

  const fetchData = async () => {
    // We remove setLoading(true) from here if we want background refresh
    try {
      const ticketRes = await axiosClient.get("/tickets/getAllTickets");
      setTickets(ticketRes.data.tickets || ticketRes.data.data || []);
      
      const chatRes = await axiosClient.get("/chat/getAllChats");
      setChats(chatRes.data.data || chatRes.data.chats || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("ticket_deleted", (data) => {
      console.log("[Socket] Ticket deleted:", data.ticketId);
      setTickets(prev => prev.filter(t => t._id !== data.ticketId));
    });

    socket.on("ticket_created", () => fetchData());
    socket.on("ticket_updated", () => fetchData());

    return () => {
      socket.off("ticket_deleted");
      socket.off("ticket_created");
      socket.off("ticket_updated");
    };
  }, [socket]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const totalTickets = tickets?.length || 0;
  const resolvedTickets = tickets?.filter(t => t.status === "resolved" || t.status === "closed").length || 0;
  const myOpenTickets = tickets?.filter(t => t.assignedTo?._id === user.id && (t.status === "open" || t.status === "in-progress" || t.status === "reopened" || t.status === "needs-human-attention")).length || 0;
  
  const alerts = tickets?.filter(t => 
    t.status === "reopened" || 
    t.status === "needs-human-attention" || 
    (t.rating && t.rating <= 3)
  ).slice(0, 5) || [];

  const stats = [
    { label: "My Open Tickets",  value: myOpenTickets,      delta: "Assigned", up: true,  Icon: Ticket },
    { label: "Tickets Resolved", value: resolvedTickets,    delta: "Total",    up: true,  Icon: CheckCircle2 },
    { label: "Chats Handled",    value: chats?.length || 0, delta: "Live",     up: true,  Icon: MessageSquare },
    { label: "Alerts",           value: alerts.length,       delta: "Action Required", up: alerts.length > 0 ? false : true, Icon: AlertCircle },
  ];

  return (
    <>
      {loading && <Loader />}
      <div style={{ flex: 1, padding: "24px", background: "#f8fbff", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
                  background: label === "Alerts" && value > 0 ? "#fef2f2" : "#f0f7ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Icon size={18} color={label === "Alerts" && value > 0 ? "#ef4444" : "#0072c6"} />
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

        {alerts.length > 0 && (
          <div style={{ marginBottom: "20px", background: "#fff", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 12px rgba(239,68,68,0.08)", border: "1px solid #fee2e2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <AlertCircle size={18} color="#ef4444" />
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#991b1b", margin: 0 }}>High Priority Alerts</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {alerts.map((alert, i) => (
                <div 
                  key={i}
                  onClick={() => alert.chatId && navigate("/agent/chat", { state: { chatId: alert.chatId } })}
                  style={{ background: "#fef2f2", border: "1px solid #fee2e2", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", flex: "1 1 300px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase" }}>
                      {alert.status === "needs-human-attention" ? "Escalated" : alert.status === "reopened" ? "Reopened" : "Low Rating"}
                    </span>
                    {alert.rating && (
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= alert.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />)}
                      </div>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1a3a4a" }}>{alert.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#7f1d1d" }}>Customer: {alert.customerId?.name || "Unknown"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px", flex: 1, minHeight: 0 }}>
          {/* Recent Tickets Section */}
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "18px",
              boxShadow: "0 2px 12px rgba(4,114,198,0.08)",
              height: "100%", minHeight: 0,
              display: "flex",
              flexDirection: "column"
            }}
          >
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#1a3a4a", margin: 0 }}>
                Recent Support Tickets
              </h3>
              <span 
                onClick={() => navigate("/agent/tickets")}
                style={{ fontSize: "11px", color: "#0072c6", cursor: "pointer", fontWeight: 600 }}
              >
                View All
              </span>
            </div>
            <div className="scrollbar-hide" style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto" }}>
              {tickets && tickets.length > 0 ? (
                tickets.slice(0, 5).map((ticket, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9"
                    }}
                  >
                    <div style={{ width: 32, height: 32, background: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", flexShrink: 0 }}>
                      <Ticket size={16} color="#64748b" style={{ margin: "auto" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1a3a4a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ticket.title}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>
                        #{ticket._id?.slice(-6).toUpperCase()} • {ticket.status}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        const cid = ticket.chatId?._id || ticket.chatId;
                        if (cid) {
                          navigate("/agent/chat", { state: { chatId: cid } });
                        }
                      }}
                      style={{ background: "#fff", border: "1px solid #e2e8f0", color: "#1f88d9", p: "6px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "12px", color: "#5a7a8a" }}>No tickets assigned yet.</p>
              )}
            </div>
          </div>

          {/* Recent Chats Section */}
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "18px",
              boxShadow: "0 2px 12px rgba(4,114,198,0.08)",
              height: "100%", minHeight: 0,
              display: "flex",
              flexDirection: "column"
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
                Active Conversations
              </h3>
              <span 
                onClick={() => navigate("/agent/chat")}
                style={{ fontSize: "11px", color: "#0072c6", cursor: "pointer", fontWeight: 600 }}
              >
                Go to Chat
              </span>
            </div>

            <div className="scrollbar-hide" style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto" }}>
              {chats && chats.length > 0 ? (
                chats.slice(0, 5).map((chat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9"
                    }}
                  >
                    <div style={{ width: 36, height: 36, background: "#1f88d9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "12px", flexShrink: 0 }}>
                      {chat.userId?.name?.charAt(0) || "U"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1a3a4a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {chat.userId?.name || "Customer"}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%" }}></span> Active Now
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate("/agent/chat", { state: { chatId: chat._id } })}
                      style={{ background: "#f0f7ff", border: "none", color: "#0072c6", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                    >
                      Open
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "12px", color: "#5a7a8a" }}>No active chats found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentDashboard;
