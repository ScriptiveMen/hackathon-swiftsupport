import { useState } from "react";
import { useNavigate } from "react-router";
import ScrollReveal from '../home/ScrollReveal';
import ScrollFade from '../home/ScrollFade';

const trustSignals = [
  { icon: "🔒", text: "SOC 2 Compliant" },
  { icon: "⚡", text: "Setup in 60 mins" },
  { icon: "💳", text: "No credit card" },
  { icon: "🌍", text: "99.99% uptime" },
];

export default function FinalCTA() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f7fbff 0%, #e8f6ff 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden px-8 py-16 lg:px-20 lg:py-20 text-center"
          style={{
            background: "linear-gradient(135deg, #04b8ff 0%, #0066bb 50%, #0044aa 100%)",
            boxShadow: "0 32px 80px rgba(4,184,255,0.40)",
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
          <div className="blob-drift absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "#6ed6ff", opacity: 0.30, filter: "blur(60px)" }} />
          <div className="blob-drift-2 absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: "#003399", opacity: 0.50, filter: "blur(80px)" }} />

          <div className="relative flex flex-col items-center justify-center gap-3 z-10">
            <ScrollFade delay={0} blur={4}>
              <div
                className="inline-flex items-center select-none gap-2 px-4 py-2 rounded-full text-[12px] font-semibold mb-6"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "white" }}
              >
                ✦ Start Free Today — No Credit Card Required
              </div>
            </ScrollFade>

            <ScrollFade delay={0.1} y={24} blur={3}>
              <h2
                className="text-[36px] lg:text-[54px] font-black text-white leading-[1.08] mb-1"
                style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
              >
                Get Started with
                <br />
                SwiftSupport Free
              </h2>
            </ScrollFade>

            <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={6} containerClassName="text-[16px] text-white/75 max-w-xl mx-auto mb-10 leading-relaxed">
              Join 500+ teams already delivering faster, smarter, and more personalized support with AI. Set up in under an hour.
            </ScrollReveal>

            {/* Email input + CTA */}
            <ScrollFade delay={0.2} y={20}>
              <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your work email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 w-full px-4 py-3.5 rounded-xl text-[14px] text-[#1e3a4a] placeholder-[#9bbccc] outline-none"
                  style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
                />
                <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto flex-shrink-0 px-6 py-3.5 rounded-xl text-[14px] font-bold text-[#0044aa] transition-all hover:-translate-y-0.5"
                  style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}
                >
                  Get Started Free →
                </button>
              </div>
            </ScrollFade>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              {trustSignals.map(({ icon, text }, i) => (
                <ScrollFade key={text} delay={0.25 + i * 0.06} y={12}>
                  <div className="flex items-center gap-1.5 text-[12px] text-white/70">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                </ScrollFade>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
