import { useNavigate } from "react-router";
import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

/* ── Mini Chat/Dashboard Mockup Widget ─────────────────── */
function DashboardMockup() {
  return (
    <div className="relative select-none w-full max-w-[480px] mx-auto">
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(4,184,255,0.22) 0%, transparent 70%)" }}
      />

      {/* Main card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(4,184,255,0.25)",
          boxShadow: "0 24px 80px rgba(4,184,255,0.20), 0 1px 0 rgba(255,255,255,0.9) inset",
        }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#0bbaff]/10">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-3 h-5 rounded-md bg-[#f0f8ff] border border-[#0bbaff]/10 flex items-center px-2">
            <span className="text-[9px] text-[#9bbccc]">app.swiftsupport.ai/dashboard</span>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-4 flex gap-3">
          {/* Sidebar */}
          <div className="w-24 flex flex-col gap-2">
            <div className="h-6 rounded-lg bg-gradient-to-r from-[#04b8ff] to-[#0077cc] flex items-center px-2 gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              <span className="text-[8px] text-white font-semibold">Dashboard</span>
            </div>
            {["Tickets", "Customers", "Analytics", "Settings"].map((item) => (
              <div key={item} className="h-5 rounded-md bg-[#f0f8ff] flex items-center px-2 gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9bbccc]" />
                <span className="text-[7px] text-[#7aaabb]">{item}</span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Active", val: "1,284", color: "#04b8ff" },
                { label: "Resolved", val: "98.2%", color: "#22c55e" },
                { label: "Avg. CSAT", val: "4.9★", color: "#f59e0b" },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-2 text-center"
                  style={{ background: `${color}12`, border: `1px solid ${color}30` }}
                >
                  <div className="text-[11px] font-bold" style={{ color }}>{val}</div>
                  <div className="text-[7px] text-[#7aaabb] mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Chat panel */}
            <div className="rounded-xl bg-[#f7fbff] border border-[#0bbaff]/10 p-2 flex flex-col gap-1.5">
              <div className="text-[7px] font-semibold text-[#4a6070] mb-1">Live Support Feed</div>
              {[
                { msg: "Hi, I need help with my order #4521", type: "user" },
                { msg: "I can help! Let me pull up your order details.", type: "bot" },
                { msg: "Your order is shipped. ETA: Tomorrow.", type: "bot" },
              ].map(({ msg, type }, i) => (
                <div key={i} className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[80%] px-2 py-1 rounded-lg text-[7px] leading-relaxed"
                    style={
                      type === "bot"
                        ? { background: "white", border: "1px solid rgba(4,184,255,0.2)", color: "#1e3a4a" }
                        : { background: "linear-gradient(135deg, #04b8ff, #0077cc)", color: "white" }
                    }
                  >
                    {msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div
        className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-[9px] font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #04b8ff, #0077cc)",
          boxShadow: "0 4px 16px rgba(4,184,255,0.45)",
        }}
      >
        ✦ AI Powered
      </div>

      {/* Floating stat card */}
      <div
        className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl text-[8px]"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(4,184,255,0.2)",
          boxShadow: "0 8px 24px rgba(4,184,255,0.15)",
        }}
      >
        <div className="text-[12px] font-bold text-[#04b8ff]">↑ 47%</div>
        <div className="text-[#7aaabb]">Resolution rate</div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      style={{
        background: "linear-gradient(180deg, #e8f6ff 0%, #ffffff 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div
        className="blob-drift absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "#0bbaff", opacity: 0.09, filter: "blur(120px)" }}
      />
      <div
        className="blob-drift-2 absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "#6ed6ff", opacity: 0.18, filter: "blur(100px)" }}
      />
      <div
        className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "#04b8ff", opacity: 0.06, filter: "blur(100px)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <ScrollFade delay={0} blur={4}>
              <div className="inline-flex items-center gap-2 self-start">
                <div
                  className="flex select-none items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold"
                  style={{
                    background: "rgba(4,184,255,0.12)",
                    border: "1px solid rgba(4,184,255,0.3)",
                    color: "#04b8ff",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#04b8ff] animate-pulse" />
                  AI Customer Support Platform
                </div>
              </div>
            </ScrollFade>

            {/* Headline */}
            <ScrollFade delay={0.1} y={24} blur={3}>
              <h1
                className="text-[52px] lg:text-[62px] leading-[1.08] font-black text-[#0a2a3a]"
                style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
              >
                Think.{" "}
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Connect.
                </span>
                <br />
                Scale. The Future
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Starts Now.
                </span>
              </h1>
            </ScrollFade>

            {/* Subtext */}
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={3}
              blurStrength={6}
              containerClassName="text-[16px] text-[#4a6070] leading-relaxed max-w-[460px]"
            >
              SwiftSupport unifies your entire customer support operation under one intelligent AI platform — from live chat to ticket management, analytics to automation.
            </ScrollReveal>

            {/* CTA buttons */}
            <ScrollFade delay={0.25} y={20}>
              <div className="flex items-center gap-5 flex-wrap">
                <button
                  onClick={() => navigate("/login")}
                  className="group cursor-pointer flex items-center gap-4 pl-8 pr-2.5 py-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #5bc8f5 0%, #4ab8ef 40%, #3aaae0 100%)",
                    boxShadow: "0 8px 32px rgba(4,184,255,0.38)",
                  }}
                >
                  <span className="text-[17px] font-semibold text-white tracking-[-0.01em]">
                    Get Started for Free
                  </span>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#ffff" }}
                  >
                    <svg
                      className="w-6 h-6 text-black transition-transform duration-570 group-hover:rotate-47"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                </button>
                <span className="text-[13px] text-[#5a7a8a] font-medium">
                  *No Credit Card Required
                </span>
              </div>
            </ScrollFade>
          </div>

          {/* Right — dashboard mockup */}
          <ScrollFade delay={0.2} y={50} blur={6}>
            <div className="flex justify-center lg:justify-end">
              <DashboardMockup />
            </div>
          </ScrollFade>
        </div>
      </div>
    </section>
  );
}
