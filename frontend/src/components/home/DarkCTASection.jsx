import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

/* ── Auto Chat UI for dark section ─────────────────── */
function AutomationChat() {
  const events = [
    { type: "trigger", label: "Customer sends message", icon: "💬" },
    { type: "ai", label: "AI classifies intent (Billing)", icon: "🤖" },
    { type: "action", label: "Fetches account data via API", icon: "⚡" },
    { type: "response", label: "Sends personalized reply", icon: "✅" },
    { type: "escalate", label: "Routes to agent if needed", icon: "👤" },
  ];

  return (
    <div className="relative w-full max-w-[360px]">
      <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(4,184,255,0.30) 0%, transparent 65%)" }} />
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #04b8ff, #0077cc)" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-white">Automation Engine</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#04b8ff] animate-pulse" />
              <span className="text-[8px] text-white/50">Running · 1,284 active flows</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          {events.map(({ type, label, icon }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] flex-shrink-0"
                  style={{
                    background: type === "trigger" ? "rgba(4,184,255,0.20)" : type === "ai" ? "rgba(139,92,246,0.20)" : type === "action" ? "rgba(245,158,11,0.20)" : type === "response" ? "rgba(34,197,94,0.20)" : "rgba(248,113,113,0.20)",
                    border: `1px solid ${type === "trigger" ? "rgba(4,184,255,0.40)" : type === "ai" ? "rgba(139,92,246,0.40)" : type === "action" ? "rgba(245,158,11,0.40)" : type === "response" ? "rgba(34,197,94,0.40)" : "rgba(248,113,113,0.40)"}`,
                  }}
                >
                  {icon}
                </div>
                {i < events.length - 1 && <div className="w-px h-2 mt-0.5" style={{ background: "rgba(255,255,255,0.12)" }} />}
              </div>
              <div className="flex-1"><span className="text-[11px] text-white/80">{label}</span></div>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "rgba(34,197,94,0.7)", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }} />
            </div>
          ))}
        </div>

        <div className="mx-4 mb-4 rounded-xl px-3 py-2.5 flex items-center justify-between" style={{ background: "rgba(4,184,255,0.10)", border: "1px solid rgba(4,184,255,0.20)" }}>
          <div className="text-center"><div className="text-[13px] font-bold text-[#04b8ff]">24ms</div><div className="text-[7px] text-white/40">Avg response</div></div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center"><div className="text-[13px] font-bold text-[#22c55e]">99.9%</div><div className="text-[7px] text-white/40">Uptime</div></div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center"><div className="text-[13px] font-bold text-[#f59e0b]">3.2M</div><div className="text-[7px] text-white/40">Msgs/month</div></div>
        </div>
      </div>
    </div>
  );
}

const autoStats = [
  { val: "90%", label: "Queries resolved by AI" },
  { val: "3×", label: "Faster resolution time" },
  { val: "60%", label: "Cost reduction" },
  { val: "24/7", label: "Always-on support" },
];

export default function DarkCTASection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #071524 0%, #0a1e30 50%, #06121e 100%)" }}
    >
      <div className="blob-drift absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "#04b8ff", opacity: 0.06, filter: "blur(100px)" }} />
      <div className="blob-drift-2 absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "#0077cc", opacity: 0.08, filter: "blur(100px)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div className="flex flex-col gap-6">
            <ScrollFade delay={0} blur={4}>
              <div
                className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-[12px] font-semibold"
                style={{ background: "rgba(4,184,255,0.12)", border: "1px solid rgba(4,184,255,0.30)", color: "#04b8ff" }}
              >
                ✦ Automation on Autopilot
              </div>
            </ScrollFade>

            <ScrollFade delay={0.1} y={24} blur={3}>
              <h2
                className="text-[36px] lg:text-[48px] font-black text-white leading-[1.1]"
                style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
              >
                Automate support functions
                <br />with{" "}
                <span style={{ background: "linear-gradient(135deg, #04b8ff 0%, #6ed6ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  AI assistance
                </span>{" "}
                on autopilot.
              </h2>
            </ScrollFade>

            <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={6} containerClassName="text-[15px] text-white/55 leading-relaxed max-w-[460px]">
              Let your AI agents handle tier-1 support while your human team focuses on complex, high-value interactions. Set rules once, automate forever.
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {autoStats.map(({ val, label }, i) => (
                <ScrollFade key={label} delay={0.15 + i * 0.07} y={20}>
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div
                      className="text-[24px] font-black"
                      style={{ background: "linear-gradient(135deg, #04b8ff, #6ed6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                    >
                      {val}
                    </div>
                    <div className="text-[12px] text-white/40 mt-0.5">{label}</div>
                  </div>
                </ScrollFade>
              ))}
            </div>

            <ScrollFade delay={0.3} y={20}>
              <button
                className="self-start flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)", boxShadow: "0 6px 24px rgba(4,184,255,0.35)" }}
              >
                Start Automating
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </ScrollFade>
          </div>

          {/* Right — automation flow */}
          <ScrollFade delay={0.2} y={50} blur={6}>
            <div className="flex justify-center lg:justify-end">
              <AutomationChat />
            </div>
          </ScrollFade>
        </div>
      </div>
    </section>
  );
}
