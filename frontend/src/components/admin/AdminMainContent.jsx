import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  Ticket,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Star,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useSocket } from "../../context/SocketContext.jsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
  const [analyticsData, setAnalyticsData] = useState([]);
  const [analyticsFilter, setAnalyticsFilter] = useState("6m");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Data Fetching
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const ticketRes = await axiosClient.get(
        `${baseUrl}/api/tickets/getAllTickets`,
      );
      setTickets(
        ticketRes.data.tickets || ticketRes.data.data || ticketRes.data || [],
      );

      const chatRes = await axiosClient.get(`${baseUrl}/api/chat/getAllChats`);
      setChats(chatRes.data.chats || chatRes.data.data || chatRes.data || []);

      const userRes = await axiosClient.get(`${baseUrl}/api/auth/users`);
      setUsers(userRes.data.users || userRes.data.data || userRes.data || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("ticket_created", () => fetchData());
    socket.on("ticket_updated", () => fetchData());
    socket.on("ticket_deleted", () => fetchData());
    socket.on("user_created", () => fetchData());
    socket.on("agent_created", () => fetchData());

    return () => {
      socket.off("ticket_created");
      socket.off("ticket_updated");
      socket.off("ticket_deleted");
      socket.off("user_created");
      socket.off("agent_created");
    };
  }, [socket]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const { data } = await axiosClient.get(
          `${baseUrl}/api/admin/messages-leads-analytics?filter=${analyticsFilter}`,
        );
        setAnalyticsData(data.data || []);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [analyticsFilter]);

  const totalAgents = users?.filter((u) => u.role === "agent").length || 0;
  const totalCustomers =
    users?.filter((u) => u.role === "customer").length || 0;
  const totalTickets = tickets?.length || 0;
  const resolvedTicketsCount =
    tickets?.filter((t) => t.status === "resolved" || t.status === "closed")
      .length || 0;

  const resolutionRate =
    totalTickets > 0
      ? ((resolvedTicketsCount / totalTickets) * 100).toFixed(1)
      : 0;

  const ticketsWithRating = tickets?.filter((t) => t.rating) || [];
  const averageRating =
    ticketsWithRating.length > 0
      ? (
          ticketsWithRating.reduce((acc, t) => acc + t.rating, 0) /
          ticketsWithRating.length
        ).toFixed(1)
      : "N/A";

  const stats = [
    {
      label: "CSAT Score",
      value: `${averageRating}/5`,
      delta: "Rating",
      up: true,
      Icon: Star,
    },
    {
      label: "Resolution Rate",
      value: `${resolutionRate}%`,
      delta: "Resolved",
      up: true,
      Icon: CheckCircle,
    },
    {
      label: "Active Tickets",
      value: totalTickets - resolvedTicketsCount,
      delta: "Open",
      up: false,
      Icon: Ticket,
    },
    {
      label: "Total Customers",
      value: totalCustomers,
      delta: "Live",
      up: true,
      Icon: Users,
    },
  ];

  const filterOptions = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 6 months", value: "6m" },
    { label: "Last 12 months", value: "12m" },
  ];

  return (
    <main
      data-lenis-prevent
      style={{ flex: 1, overflowY: "auto", padding: "24px" }}
    >
      {/* Analytics Graph */}
      <div
        style={{
          background: "linear-gradient(135deg, #1f88d9 0%, #0072c6 100%)",
          borderRadius: "24px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 10px 25px rgba(0, 114, 198, 0.2)",
          position: "relative",
          minHeight: "340px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Organization Performance
          </h2>
          <div style={{ position: "relative" }}>
            <select
              value={analyticsFilter}
              onChange={(e) => setAnalyticsFilter(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 600,
                padding: "6px 30px 6px 12px",
                appearance: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {filterOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{ color: "#000" }}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              color="#fff"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div style={{ height: "240px", width: "100%" }}>
          {analyticsLoading ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
              }}
            >
              Fetching latest platform data...
            </div>
          ) : analyticsData.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
              }}
            >
              No analytics data available for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: 600 }}
                  labelStyle={{
                    color: "#5a7a8a",
                    marginBottom: "4px",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#fff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={1500}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#fff",
                    fill: "#1f88d9",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
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
                background: label === "CSAT Score" ? "#fff9eb" : "#f0f7ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <Icon
                size={18}
                color={label === "CSAT Score" ? "#f59e0b" : "#0072c6"}
              />
            </div>
            <p
              style={{ fontSize: "12px", color: "#5a7a8a", margin: "0 0 6px" }}
            >
              {label}
            </p>
            <div
              style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
            >
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
        {/* Recent Tickets & Reports */}
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
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1a3a4a",
                margin: 0,
              }}
            >
              Recent Tickets & Customer Feedback
            </h3>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {tickets && tickets.length > 0 ? (
              tickets.slice(0, 5).map((ticket) => (
                <div
                  key={ticket._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: "#fff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Users size={16} color="#64748b" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1a3a4a",
                      }}
                    >
                      {ticket.title}
                    </p>
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "2px" }}
                    >
                      <span style={{ fontSize: "11px", color: "#5a7a8a" }}>
                        Status: {ticket.status}
                      </span>
                      {ticket.rating && (
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <Star
                            size={10}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#f59e0b",
                              fontWeight: 700,
                            }}
                          >
                            {ticket.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {ticket.feedback && (
                    <div
                      style={{
                        maxWidth: "200px",
                        fontSize: "11px",
                        color: "#64748b",
                        fontStyle: "italic",
                      }}
                    >
                      "{ticket.feedback.substring(0, 50)}..."
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ fontSize: "12px", color: "#5a7a8a" }}>
                No tickets found.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMainContent;
