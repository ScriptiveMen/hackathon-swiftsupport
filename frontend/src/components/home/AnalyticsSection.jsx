import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

/* ── Sparkline SVG ──────────────────────────────────── */
function Sparkline({ data, color, height = 60 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200;
  const h = height;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M 0,${h} L ${pathD.slice(2)} L ${w},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const metrics = [
  { label: "Tickets Resolved", value: "11,392", delta: "+12%", positive: true, color: "#04b8ff", data: [30, 45, 38, 55, 42, 60, 52, 68, 75, 82, 78, 92] },
  { label: "Customer Satisfaction", value: "4.9 / 5", delta: "+0.3", positive: true, color: "#22c55e", data: [60, 65, 62, 70, 74, 72, 78, 80, 84, 86, 89, 95] },
  { label: "Avg Response Time", value: "1.4 min", delta: "-18%", positive: true, color: "#f59e0b", data: [90, 82, 76, 70, 68, 60, 55, 50, 45, 42, 38, 34] },
];

const miniStats = [
  { label: "Reports Generated", val: "50K+" },
  { label: "Data Points/sec", val: "2.4M" },
  { label: "Integrations", val: "120+" },
  { label: "Uptime SLA", val: "99.99%" },
];

export default function AnalyticsSection() {
  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(232,246,255,0.8) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div className="flex flex-col gap-6">
            <ScrollFade delay={0} blur={4}>
              <div
                className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-[12px] font-semibold"
                style={{
                  background: "rgba(4,184,255,0.10)",
                  border: "1px solid rgba(4,184,255,0.25)",
                  color: "#04b8ff",
                }}
              >
                ✦ Analytics & Growth
              </div>
            </ScrollFade>

            <ScrollFade delay={0.1} y={24} blur={3}>
              <h2
                className="text-[36px] lg:text-[44px] font-black text-[#0a2a3a] leading-[1.1]"
                style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
              >
                Monitor business growth
                <br />and{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  team performance
                </span>
              </h2>
            </ScrollFade>

            <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={6} containerClassName="text-[15px] text-[#4a6070] leading-relaxed">
              Real-time dashboards give you complete visibility into every interaction. Track KPIs, identify trends, and make data-driven decisions that accelerate growth.
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {miniStats.map(({ label, val }, i) => (
                <ScrollFade key={label} delay={0.15 + i * 0.07} y={20}>
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.80)",
                      border: "1px solid rgba(4,184,255,0.15)",
                      boxShadow: "0 2px 12px rgba(4,184,255,0.06)",
                    }}
                  >
                    <div className="text-[22px] font-black text-[#0a2a3a]" style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif" }}>{val}</div>
                    <div className="text-[11px] text-[#7aaabb] mt-0.5">{label}</div>
                  </div>
                </ScrollFade>
              ))}
            </div>
          </div>

          {/* Right — sparkline cards */}
          <div className="flex flex-col gap-4">
            {metrics.map(({ label, value, delta, positive, color, data }, i) => (
              <ScrollFade key={label} delay={i * 0.1} y={30} blur={3}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(4,184,255,0.14)",
                    boxShadow: "0 4px 20px rgba(4,184,255,0.08)",
                  }}
                >
                  <div className="px-5 pt-4 pb-1 flex items-center justify-between">
                    <div>
                      <div className="text-[12px] font-medium text-[#5a7a8a]">{label}</div>
                      <div className="text-[24px] font-black text-[#0a2a3a] mt-0.5" style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif" }}>{value}</div>
                    </div>
                    <div
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                      style={{
                        background: positive ? `${color}15` : "#fef2f2",
                        color: positive ? color : "#dc2626",
                        border: `1px solid ${positive ? color : "#fecaca"}40`,
                      }}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d={positive ? "M7 17L17 7M17 7H7M17 7v10" : "M7 7l10 10M7 7h10M7 7v10"} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {delta}
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <Sparkline data={data} color={color} height={56} />
                  </div>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
