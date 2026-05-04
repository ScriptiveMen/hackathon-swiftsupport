import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Ticket,
  MessageSquare,
  Users,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const lineData = [
  { month: "Jan", value: 800 },
  { month: "Feb", value: 2100 },
  { month: "Mar", value: 5400 },
  { month: "Apr", value: 8800 },
  { month: "May", value: 12400 },
  { month: "Jun", value: 17200 },
];

const areaData = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 6000 },
  { day: "Wed", value: 12000 },
  { day: "Thu", value: 9000 },
  { day: "Fri", value: 18000 },
  { day: "Sat", value: 14000 },
  { day: "Sun", value: 22000 },
];

const stats = [
  { label: "Chats Handled",    value: "284",   delta: "+8%",   up: true,  Icon: MessageSquare },
  { label: "Tickets Resolved", value: "139",   delta: "+14%",  up: true,  Icon: CheckCircle2 },
  { label: "Customers Served", value: "1,120", delta: "-3%",   up: false, Icon: Users },
  { label: "Avg. Response",    value: "1.4m",  delta: "Steady", up: null, Icon: BarChart2 },
];

const recentChats = [
  { name: "John Doe",      msg: "I need help with my billing...",   time: "2m ago",  active: true  },
  { name: "Sarah Smith",   msg: "How do I reset my password?",      time: "15m ago", active: true  },
  { name: "Mike Johnson",  msg: "Thanks for the support!",          time: "1h ago",  active: false },
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */
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

/* ─── Main Component ─────────────────────────────────────────────────────────── */
const AgentDashboard = () => {
  return (
    <main data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

      {/* Messages & Leads chart — same as Admin */}
      <div
        style={{
          background: "linear-gradient(135deg,#3b9edd 0%,#0072c6 100%)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "20px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>
            Chat Activity
          </h2>
          <button
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              padding: "5px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Last 6 months <ChevronDown size={13} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "none",
                borderRadius: "10px",
                color: "#1a3a4a",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#fff", stroke: "#3b9edd", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stat cards — same structure as Admin */}
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

      {/* Bottom row — same 1fr 1fr grid as Admin */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Daily Chat Activity Area Chart */}
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
              Daily Chat Volume
            </h3>
            <button
              style={{
                background: "#f0f7ff",
                border: "none",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#5a7a8a",
                padding: "4px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              This Week <ChevronDown size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorChat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#04b8ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#04b8ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#5a7a8a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#5a7a8a" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "11px",
                  color: "#1a3a4a",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#04b8ff"
                strokeWidth={2}
                fill="url(#colorChat)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Chats */}
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
              Recent Chats
            </h3>
            <button
              style={{
                background: "#f0f7ff",
                border: "none",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#5a7a8a",
                padding: "4px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Sort by Recent <ChevronDown size={12} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentChats.map((chat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#dbeafe",
                      color: "#0072c6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {chat.name.charAt(0)}
                  </div>
                  {chat.active && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        background: "#10b981",
                        borderRadius: "50%",
                        border: "2px solid #fff",
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1a3a4a" }}>
                    {chat.name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "11px",
                      color: "#5a7a8a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {chat.msg}
                  </p>
                </div>
                <span style={{ fontSize: "11px", color: "#9ab0be", whiteSpace: "nowrap" }}>
                  {chat.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
};

export default AgentDashboard;
