import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "AI-Powered Live Chat",
    desc: "Deploy intelligent chatbots that resolve queries 24/7 with human-like empathy and precision.",
    color: "#04b8ff",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Smart Ticket Routing",
    desc: "Automatically categorize and assign tickets to the right agent based on expertise and availability.",
    color: "#6d28d9",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Real-Time Analytics",
    desc: "Monitor team performance, customer satisfaction, and response metrics with live dashboards.",
    color: "#059669",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Workflow Automation",
    desc: "Build no-code automation flows that trigger responses, escalations, and follow-ups instantly.",
    color: "#d97706",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Omnichannel Inbox",
    desc: "Manage conversations from email, chat, social media, and voice in a single unified workspace.",
    color: "#e11d48",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Enterprise Security",
    desc: "SOC 2 Type II compliant with end-to-end encryption, SSO, and role-based access control.",
    color: "#0891b2",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(232,246,255,0.6) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center flex flex-col items-center justify-center mb-16">
          <ScrollFade delay={0} blur={4}>
            <div
              className="inline-flex select-none items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold mb-5"
              style={{
                background: "rgba(4,184,255,0.10)",
                border: "1px solid rgba(4,184,255,0.25)",
                color: "#04b8ff",
              }}
            >
              ✦ Platform Features
            </div>
          </ScrollFade>

          <ScrollFade delay={0.1} y={24} blur={3}>
            <h2
              className="text-[40px] lg:text-[48px] font-black text-[#0a2a3a] leading-[1.1]"
              style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              The Complete Platform for
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI Support Agents
              </span>
            </h2>
          </ScrollFade>

          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={3}
            blurStrength={6}
            containerClassName=" text-[16px] text-[#4a6070] mt-7 max-w-xl mx-auto leading-relaxed"
          >
            Everything your support team needs to deliver faster, smarter, and more personalized customer experiences.
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 select-none md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc, color }, i) => (
            <ScrollFade key={title} delay={i * 0.08} y={30} blur={3}>
              <div
                className="group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full"
                style={{
                  background: "rgba(255,255,255,0.80)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(4,184,255,0.14)",
                  boxShadow: "0 4px 24px rgba(4,184,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 40px ${color}22, 0 1px 0 rgba(255,255,255,0.9) inset`;
                  e.currentTarget.style.borderColor = `${color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(4,184,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(4,184,255,0.14)";
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}15`, color }}
                >
                  {icon}
                </div>
                <h3 className="text-[17px] font-bold text-[#0a2a3a] mb-2">{title}</h3>
                <p className="text-[14px] text-[#5a7a8a] leading-relaxed">{desc}</p>

                {/* Hover arrow */}
                <div
                  className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ background: `${color}15` }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  );
}
