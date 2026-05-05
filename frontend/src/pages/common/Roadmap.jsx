import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";
import ScrollReveal from "../../components/home/ScrollReveal";

const Roadmap = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const milestones = [
    {
      quarter: "Q1 2026",
      status: "In Progress",
      title: "Advanced AI Personalization",
      desc: "Training models on organization-specific knowledge bases for even more accurate and brand-aligned responses.",
      items: ["Brand Voice Tuning", "Multilingual Support (20+ languages)", "Automated FAQ Generation"]
    },
    {
      quarter: "Q2 2026",
      status: "Planned",
      title: "Omnichannel Expansion",
      desc: "Integrating directly with WhatsApp, Instagram DM, and Slack to manage every conversation in one place.",
      items: ["WhatsApp Business API", "Social Media Inbox", "Slack Support Bot"]
    },
    {
      quarter: "Q3 2026",
      status: "On the Horizon",
      title: "Predictive Analytics & Forecasting",
      desc: "AI that predicts support volume surges and suggests staffing levels before they happen.",
      items: ["Volume Forecasting", "Sentiment Trend Analysis", "Churn Risk Detection"]
    },
    {
      quarter: "Q4 2026",
      status: "Visionary",
      title: "Voice Support Integration",
      desc: "Bringing our AI-powered support to the phone with natural-sounding voice agents.",
      items: ["AI Phone Support", "Voice Sentiment Analysis", "Real-time Call Transcription"]
    }
  ];

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center flex flex-col items-center justify-center mb-20">
          <ScrollFade delay={0} y={30}>
            <h1 className="text-4xl md:text-6xl font-black text-[#0a2a3a] mb-6 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              Our <span className="text-[#04b8ff]">Roadmap</span>
            </h1>
          </ScrollFade>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            blurStrength={8}
            containerClassName="text-lg text-[#4a6070] max-w-2xl mx-auto leading-relaxed"
          >
            The future of customer support is intelligent, fast, and unified. Here's how we're building it.
          </ScrollReveal>
        </div>

        <div className="relative border-l-2 border-[#04b8ff]/20 ml-4 md:ml-8 pl-8 md:pl-12 space-y-20">
          {milestones.map((m, i) => (
            <ScrollFade key={i} delay={0.1 * i} y={30}>
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[41px] md:-left-[57px] top-0 w-6 h-6 rounded-full bg-white border-4 border-[#04b8ff] shadow-sm" />
                
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                  <span className="text-[12px] font-bold text-[#04b8ff] uppercase tracking-wider">{m.quarter}</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${
                    m.status === "In Progress" ? "bg-blue-100 text-blue-600" : 
                    m.status === "Planned" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-[#04b8ff]/10 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-bold text-[#0a2a3a] mb-4">{m.title}</h3>
                  <p className="text-[#4a6070] mb-6 leading-relaxed">{m.desc}</p>
                  
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {m.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#5a7a8a]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#04b8ff]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>

        <ScrollFade delay={0.5} y={20}>
          <div className="mt-24 p-10 rounded-[2.5rem] bg-[#0a2a3a] text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Have a feature request?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">We build SwiftSupport for you. Tell us what tools your team needs to succeed.</p>
            <button className="px-10 py-4 bg-[#04b8ff] text-white rounded-full font-bold hover:bg-white hover:text-[#0a2a3a] transition-all duration-300">
              Submit Feedback
            </button>
          </div>
        </ScrollFade>
      </div>
    </div>
  );
};

export default Roadmap;
