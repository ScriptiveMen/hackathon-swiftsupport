import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

const steps = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in under 60 seconds. No credit card required. Connect your existing tools and import your team members instantly.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: "#04b8ff",
    mockup: (
      <div className="mt-4 rounded-xl overflow-hidden" style={{ background: "#f7fbff", border: "1px solid rgba(4,184,255,0.15)" }}>
        <div className="px-3 py-2 border-b border-[#0bbaff]/10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="p-3 flex flex-col gap-2">
          {["Full Name", "Work Email", "Password"].map((f) => (
            <div key={f} className="h-7 rounded-lg bg-white border border-[#0bbaff]/20 flex items-center px-2.5">
              <span className="text-[8px] text-[#9bbccc]">{f}</span>
            </div>
          ))}
          <div className="h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #04b8ff, #0077cc)" }}>
            <span className="text-[8px] font-semibold text-white">Create Account →</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Configure Your AI Agent",
    desc: "Train your AI with your brand voice, FAQ knowledge base, and escalation rules. No coding required — our visual builder does the heavy lifting.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "#8b5cf6",
    mockup: (
      <div className="mt-4 rounded-xl overflow-hidden" style={{ background: "#f7fbff", border: "1px solid rgba(139,92,246,0.15)" }}>
        <div className="p-3 flex flex-col gap-1.5">
          <div className="text-[7px] font-semibold text-[#4a6070] mb-1">AI Configuration Panel</div>
          {["Brand Voice: Professional", "Tone: Friendly", "Language: English", "Auto-escalate: Yes"].map((cfg) => (
            <div key={cfg} className="h-6 rounded-lg bg-white border border-[#8b5cf6]/15 flex items-center px-2.5 gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
              <span className="text-[7px] text-[#5a7a8a]">{cfg}</span>
              <span className="ml-auto text-[6px] text-green-500 font-semibold">✓</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "Go Live & Scale",
    desc: "Embed the chat widget, activate your AI agents, and watch your support metrics improve from day one. Scale up or down as needed.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "#22c55e",
    mockup: (
      <div className="mt-4 rounded-xl overflow-hidden" style={{ background: "#f7fbff", border: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="p-3 flex flex-col gap-2">
          <div className="text-[7px] font-semibold text-[#4a6070] mb-1">Live Performance</div>
          {[
            { label: "Active Conversations", val: "284", color: "#22c55e" },
            { label: "AI Resolved Today", val: "1,024", color: "#04b8ff" },
            { label: "CSAT Score", val: "4.9★", color: "#f59e0b" },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex items-center justify-between h-6 px-2.5 rounded-lg bg-white border" style={{ borderColor: `${color}20` }}>
              <span className="text-[7px] text-[#5a7a8a]">{label}</span>
              <span className="text-[8px] font-bold" style={{ color }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function SetupSteps() {
  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, rgba(232,246,255,0.7) 0%, rgba(255,255,255,0.9) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollFade delay={0} blur={4}>
            <div
              className="inline-flex select-none items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold mb-5"
              style={{
                background: "rgba(4,184,255,0.10)",
                border: "1px solid rgba(4,184,255,0.25)",
                color: "#04b8ff",
              }}
            >
              ✦ Quick Setup
            </div>
          </ScrollFade>

          <ScrollFade delay={0.1} y={24} blur={3}>
            <h2
              className="text-[36px] lg:text-[46px] font-black text-[#0a2a3a] leading-[1.1]"
              style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              Get up and running in{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                3 simple steps
              </span>
            </h2>
          </ScrollFade>

          <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={6} containerClassName="text-[15px] text-[#4a6070] mt-4 max-w-lg mx-auto">
            No complex onboarding. No lengthy training. Just a powerful AI support system that works from day one.
          </ScrollReveal>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ num, title, desc, icon, color, mockup }, i) => (
            <ScrollFade key={num} delay={i * 0.12} y={40} blur={4}>
              <div
                className="relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(4,184,255,0.14)",
                  boxShadow: "0 4px 24px rgba(4,184,255,0.07)",
                }}
              >
                <div className="absolute top-5 right-5 text-[40px] font-black leading-none select-none" style={{ color: `${color}12`, fontFamily: "'Switzer Extrabold', 'Inter', sans-serif" }}>
                  {num}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 select-none" style={{ background: `${color}15`, color }}>
                  {icon}
                </div>
                <div className="inline-flex select-none items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider mb-3" style={{ background: `${color}15`, color }}>
                  Step {num}
                </div>
                <h3 className="text-[18px] font-bold text-[#0a2a3a] mb-2">{title}</h3>
                <p className="text-[13px] text-[#5a7a8a] leading-relaxed">{desc}</p>
                {mockup}
              </div>
            </ScrollFade>
          ))}
        </div>

        {/* Connector arrows (desktop) */}
        <div className="hidden md:flex items-center justify-center gap-0 mt-6 -translate-y-[280px] pointer-events-none">
          {[0, 1].map((i) => (
            <div key={i} className="flex-1 flex items-center justify-center" style={{ transform: `translateX(${i === 0 ? "33%" : "-33%"})` }}>
              <svg className="w-8 h-8 text-[#04b8ff]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
