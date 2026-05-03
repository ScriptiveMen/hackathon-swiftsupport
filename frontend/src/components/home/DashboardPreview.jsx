import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

/* ── Full Dashboard Mockup ──────────────────────────── */
function FullDashboard() {
  const ticketData = [
    { label: "Mon", open: 42, closed: 38 },
    { label: "Tue", open: 55, closed: 50 },
    { label: "Wed", open: 38, closed: 36 },
    { label: "Thu", open: 61, closed: 55 },
    { label: "Fri", open: 48, closed: 46 },
    { label: "Sat", open: 29, closed: 28 },
    { label: "Sun", open: 22, closed: 22 },
  ];
  const maxVal = Math.max(...ticketData.map((d) => d.open));

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.90)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(4,184,255,0.20)",
        boxShadow: "0 24px 80px rgba(4,184,255,0.16)",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#0bbaff]/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4 h-6 rounded-lg bg-[#f0f8ff] border border-[#0bbaff]/10 flex items-center px-3">
          <span className="text-[10px] text-[#9bbccc]">app.swiftsupport.ai — Analytics Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-[#7aaabb] font-semibold">Live</span>
        </div>
      </div>

      <div className="p-5 flex gap-4">
        {/* Left sidebar */}
        <div className="w-36 flex flex-col gap-2 flex-shrink-0">
          <div className="h-7 rounded-xl bg-gradient-to-r from-[#04b8ff] to-[#0077cc] flex items-center px-3 gap-2">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
            <span className="text-[9px] text-white font-semibold">Dashboard</span>
          </div>
          {["Inbox", "Tickets", "Customers", "Agents", "Reports", "Settings"].map((item) => (
            <div key={item} className="h-6 rounded-lg bg-[#f7fbff] border border-[#0bbaff]/08 flex items-center px-2.5 gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5dde8]" />
              <span className="text-[8px] text-[#7aaabb]">{item}</span>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total Tickets", val: "12,847", delta: "+8.2%", color: "#04b8ff" },
              { label: "Resolved", val: "11,392", delta: "+12%", color: "#22c55e" },
              { label: "Avg Response", val: "1.4 min", delta: "-18%", color: "#f59e0b" },
              { label: "CSAT Score", val: "4.9 / 5", delta: "+0.3", color: "#8b5cf6" },
            ].map(({ label, val, delta, color }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
              >
                <div className="text-[13px] font-bold" style={{ color }}>{val}</div>
                <div className="text-[7px] text-[#7aaabb] mt-0.5">{label}</div>
                <div className="text-[7px] font-semibold mt-1" style={{ color: delta.startsWith("-") ? "#22c55e" : color }}>
                  {delta} this week
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div
            className="rounded-xl p-3"
            style={{ background: "#f7fbff", border: "1px solid rgba(4,184,255,0.10)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-semibold text-[#1e3a4a]">Ticket Volume — This Week</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-[#04b8ff]" />
                  <span className="text-[7px] text-[#7aaabb]">Opened</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-[#22c55e]" />
                  <span className="text-[7px] text-[#7aaabb]">Closed</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-24">
              {ticketData.map(({ label, open, closed }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5" style={{ height: 72 }}>
                    <div
                      className="flex-1 rounded-t-md transition-all"
                      style={{
                        height: `${(open / maxVal) * 100}%`,
                        background: "linear-gradient(180deg, #04b8ff 0%, #0077cc 100%)",
                        opacity: 0.85,
                      }}
                    />
                    <div
                      className="flex-1 rounded-t-md transition-all"
                      style={{
                        height: `${(closed / maxVal) * 100}%`,
                        background: "linear-gradient(180deg, #22c55e 0%, #15803d 100%)",
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  <span className="text-[6px] text-[#9bbccc]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent tickets mini table */}
          <div
            className="rounded-xl p-3"
            style={{ background: "#f7fbff", border: "1px solid rgba(4,184,255,0.10)" }}
          >
            <div className="text-[9px] font-semibold text-[#1e3a4a] mb-2">Recent Tickets</div>
            {[
              { id: "#4821", user: "Alex M.", issue: "Login issue", status: "Open", priority: "High" },
              { id: "#4820", user: "Sarah K.", issue: "Billing query", status: "Resolved", priority: "Low" },
              { id: "#4819", user: "Tom R.", issue: "API access", status: "Pending", priority: "Med" },
            ].map(({ id, user, issue, status, priority }) => (
              <div key={id} className="flex items-center gap-3 py-1.5 border-b border-[#0bbaff]/06 last:border-0">
                <span className="text-[7px] text-[#04b8ff] font-semibold w-8">{id}</span>
                <span className="text-[7px] text-[#1e3a4a] w-12">{user}</span>
                <span className="text-[7px] text-[#5a7a8a] flex-1">{issue}</span>
                <span
                  className="text-[6px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: status === "Resolved" ? "#dcfce7" : status === "Open" ? "#eff6ff" : "#fff7ed",
                    color: status === "Resolved" ? "#15803d" : status === "Open" ? "#1d4ed8" : "#c2410c",
                  }}
                >
                  {status}
                </span>
                <span
                  className="text-[6px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: priority === "High" ? "#fef2f2" : priority === "Low" ? "#f0fdf4" : "#fffbeb",
                    color: priority === "High" ? "#dc2626" : priority === "Low" ? "#16a34a" : "#d97706",
                  }}
                >
                  {priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #e8f6ff 0%, #d6efff 100%)" }}
    >
      <div className="max-w-7xl text-center mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center flex flex-col items-center justify-center mb-12">
          <ScrollFade delay={0} blur={4}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold mb-5"
              style={{
                background: "rgba(4,184,255,0.10)",
                border: "1px solid rgba(4,184,255,0.25)",
                color: "#04b8ff",
              }}
            >
              ✦ SwiftSupport Dashboard
            </div>
          </ScrollFade>
          <ScrollFade delay={0.1} y={24} blur={3}>
            <h2
              className="text-[36px] lg:text-[46px] font-black text-[#0a2a3a] leading-[1.1]"
              style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              Quick to setup,
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                easy for any great team.
              </span>
            </h2>
          </ScrollFade>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={3}
            blurStrength={6}
            containerClassName="text-[15px] text-[#4a6070] mt-4 max-w-lg mx-auto"
          >
            A powerful, intuitive dashboard that gives your entire team complete visibility and control.
          </ScrollReveal>
        </div>

        {/* Dashboard screenshot */}
        <ScrollFade delay={0.2} y={40} blur={5}>
          <div className="relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(4,184,255,0.15) 0%, transparent 65%)" }}
            />
            <FullDashboard />
          </div>
        </ScrollFade>
      </div>
    </section>
  );
}
