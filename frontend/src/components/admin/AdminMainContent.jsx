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
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const lineData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 3400 },
  { month: "Mar", value: 8200 },
  { month: "Apr", value: 11000 },
  { month: "May", value: 16500 },
  { month: "Jun", value: 20800 },
];

const areaData = [
  { year: "2016", value: 0 },
  { year: "2017", value: 8000 },
  { year: "2018", value: 15000 },
  { year: "2019", value: 22000 },
  { year: "2020", value: 35000 },
  { year: "2021", value: 48000 },
  { year: "2022", value: 62000 },
  { year: "2023", value: 80000 },
];

const stats = [
  { label: "Total AI Agents",    value: "1,450", delta: "+12%", up: true,  Icon: Users },
  { label: "Total Tickets",      value: "1,450", delta: "-5%",  up: false, Icon: Ticket },
  { label: "Messages Sent",      value: "12,450",delta: "+18%", up: true,  Icon: MessageSquare },
  { label: "Conversion Rate",    value: "18%",   delta: "Steady",up: null, Icon: BarChart2 },
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */
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
  return (
    <main data-lenis-prevent style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      {/* Messages & Leads chart */}
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
            Messages and Leads
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
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}0k` : v)}
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Daily Messages */}
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
              Daily Messages
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
              Sort by Daily <ChevronDown size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#04b8ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#04b8ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="year"
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
                fill="url(#colorMsg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

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
              Recent User Inquiries
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "140px",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "#f0f7ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HelpCircle size={22} color="#5a7a8a" />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1a3a4a",
                  margin: "0 0 4px",
                }}
              >
                No User Inquiry
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#5a7a8a",
                  margin: 0,
                  maxWidth: "260px",
                  lineHeight: 1.5,
                }}
              >
                No new user inquiries found. By default, user inquiries are turned off.
                To enable them, navigate to your AI Agent settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMainContent;
