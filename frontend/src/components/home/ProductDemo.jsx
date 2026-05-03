import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

/* ── Chat UI Mockup ─────────────────────────────────── */
function ChatMockup() {
  const messages = [
    { from: "user", text: "Hey, I can't access my account. Can you help?" },
    { from: "bot", text: "Of course! Let me verify your identity first. Can you share your email?" },
    { from: "user", text: "Sure, it's alex@example.com" },
    { from: "bot", text: "Got it! I've sent a password reset link to your inbox. Check it out 🎉" },
  ];

  return (
    <div
      className="relative rounded-2xl overflow-hidden w-full max-w-[380px]"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(4,184,255,0.20)",
        boxShadow: "0 20px 60px rgba(4,184,255,0.18)",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{ background: "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)" }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">AI</div>
        <div>
          <div className="text-[12px] font-semibold text-white">SwiftSupport AI</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            <span className="text-[9px] text-white/80">Always Online</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {["−", "□", "×"].map((s) => (
            <span key={s} className="text-white/70 text-[11px] cursor-pointer hover:text-white">{s}</span>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2.5 min-h-[220px]">
        {messages.map(({ from, text }, i) => (
          <div key={i} className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
            {from === "bot" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#04b8ff] to-[#0077cc] flex items-center justify-center text-[7px] font-bold text-white mr-2 flex-shrink-0 self-end">AI</div>
            )}
            <div
              className="max-w-[75%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed"
              style={
                from === "user"
                  ? { background: "linear-gradient(135deg, #04b8ff, #0077cc)", color: "white", borderBottomRightRadius: 4 }
                  : { background: "#f0f8ff", color: "#1e3a4a", border: "1px solid rgba(4,184,255,0.15)", borderBottomLeftRadius: 4 }
              }
            >
              {text}
            </div>
          </div>
        ))}
        <div className="flex justify-start">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#04b8ff] to-[#0077cc] flex items-center justify-center text-[7px] font-bold text-white mr-2 flex-shrink-0 self-end">AI</div>
          <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-[#f0f8ff] border border-[#0bbaff]/15 flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#9bbccc]" style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#f7fbff", border: "1px solid rgba(4,184,255,0.20)" }}>
          <span className="text-[11px] text-[#9bbccc] flex-1">Type your message...</span>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #04b8ff, #0077cc)" }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

const perks = [
  "Responds in under 2 seconds",
  "Handles 90% of queries without agents",
  "Learns from every conversation",
  "Seamless human handoff when needed",
];

export default function ProductDemo() {
  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f0f9ff 0%, #e8f6ff 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
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
                ✦ Engage in Seconds
              </div>
            </ScrollFade>

            <ScrollFade delay={0.1} y={24} blur={3}>
              <h2
                className="text-[36px] lg:text-[44px] font-black text-[#0a2a3a] leading-[1.1]"
                style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
              >
                Engage in Seconds,{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Set up in minutes.
                </span>
              </h2>
            </ScrollFade>

            <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={6} containerClassName="text-[15px] text-[#4a6070] leading-relaxed">
              Go from zero to a fully operational AI support team in minutes — not weeks. Our intelligent chat agents are trained, configured, and ready to handle real customer interactions from day one.
            </ScrollReveal>

            <ul className="flex flex-col gap-3">
              {perks.map((perk, i) => (
                <ScrollFade key={perk} delay={0.15 + i * 0.07} y={16}>
                  <li className="flex items-center gap-3 text-[14px] text-[#1e3a4a]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(4,184,255,0.12)" }}>
                      <svg className="w-3 h-3 text-[#04b8ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {perk}
                  </li>
                </ScrollFade>
              ))}
            </ul>

            <ScrollFade delay={0.3} y={20}>
              <button
                className="self-start flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)",
                  boxShadow: "0 6px 20px rgba(4,184,255,0.35)",
                }}
              >
                See It In Action
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </ScrollFade>
          </div>

          {/* Right — chat mockup */}
          <ScrollFade delay={0.15} y={50} blur={6}>
            <div className="flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(4,184,255,0.18) 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <ChatMockup />
                <div
                  className="absolute -top-4 -right-6 px-3 py-2 rounded-xl text-[10px] font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(4,184,255,0.2)",
                    boxShadow: "0 8px 24px rgba(4,184,255,0.14)",
                    color: "#1e3a4a",
                  }}
                >
                  <div className="text-[14px] font-bold text-[#22c55e]">98.4%</div>
                  <div className="text-[#7aaabb]">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </div>
    </section>
  );
}
