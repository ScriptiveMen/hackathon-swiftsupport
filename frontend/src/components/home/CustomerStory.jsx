import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

const stats = [
  { val: "10K+", label: "Active Users" },
  { val: "99%", label: "Satisfaction" },
  { val: "AI", label: "Powered" },
  { val: "24/7", label: "Support" },
];

export default function CustomerStory() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #e8f6ff 0%, #d0ebff 100%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollFade delay={0} y={40} blur={5}>
          <div
            className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-end"
            style={{
              background: "linear-gradient(135deg, #071524 0%, #0d2640 60%, #0a1e35 100%)",
              boxShadow: "0 32px 80px rgba(4,184,255,0.20)",
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "#04b8ff", opacity: 0.08, filter: "blur(100px)" }} />

            {/* Person silhouette */}
            <div className="absolute top-0 right-8 bottom-0 flex items-end">
              <div className="w-72 h-80 rounded-t-full flex items-end justify-center overflow-hidden" style={{ background: "rgba(4,184,255,0.06)", border: "1px solid rgba(4,184,255,0.15)", borderBottom: "none" }}>
                <div className="flex flex-col items-center pb-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#04b8ff]/30 to-[#0077cc]/20 border border-[#04b8ff]/30 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-[#04b8ff]/60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-[12px] font-semibold text-white/70">Sarah Chen</div>
                    <div className="text-[9px] text-[#04b8ff]/70">Head of Support @ TechNova</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote / content overlay */}
            <div className="relative z-10 p-10 lg:p-14 max-w-[65%]">
              <div className="text-[#04b8ff] text-[48px] font-black leading-none mb-4" style={{ fontFamily: "Georgia, serif" }}>"</div>

              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={2}
                blurStrength={5}
                containerClassName="text-[18px] lg:text-[22px] text-white font-medium leading-relaxed mb-6"
              >
                SwiftSupport cut our first-response time from 8 hours to under 90 seconds. Our customers noticed the difference immediately.
              </ScrollReveal>

              <ScrollFade delay={0.1} y={16}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ background: "linear-gradient(135deg, #04b8ff, #0077cc)" }}>SC</div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">Sarah Chen</div>
                    <div className="text-[11px] text-white/50">Head of Support, TechNova Inc.</div>
                  </div>
                </div>
              </ScrollFade>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                {stats.map(({ val, label }, i) => (
                  <ScrollFade key={label} delay={0.15 + i * 0.07} y={16}>
                    <div className="text-center">
                      <div className="text-[28px] font-black text-white" style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif" }}>{val}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
                    </div>
                  </ScrollFade>
                ))}
              </div>
            </div>
          </div>
        </ScrollFade>
      </div>
    </section>
  );
}
