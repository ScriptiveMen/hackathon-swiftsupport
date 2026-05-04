import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Features = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".feature-header", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });
            gsap.from(cardsRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2,
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const featureList = [
        {
            title: "AI-Powered Support",
            desc: "Smart AI that understands customer intent and provides instant, accurate resolutions 24/7.",
            icon: "ri-robot-2-line",
            color: "#04b8ff"
        },
        {
            title: "Live Chat Experience",
            desc: "Ultra-fast real-time messaging with typing indicators, file sharing, and rich media support.",
            icon: "ri-chat-voice-line",
            color: "#0077cc"
        },
        {
            title: "Ticket Management",
            desc: "A centralized hub to track, prioritize, and resolve customer issues across multiple channels.",
            icon: "ri-ticket-2-line",
            color: "#6366f1"
        },
        {
            title: "Multi-Agent Collab",
            desc: "Seamless handovers between agents with internal notes and team-based collision detection.",
            icon: "ri-team-line",
            color: "#8b5cf6"
        },
        {
            title: "Smart Automations",
            desc: "Workflow triggers and macros to eliminate repetitive tasks and speed up response times.",
            icon: "ri-magic-line",
            color: "#ec4899"
        },
        {
            title: "Advanced Analytics",
            desc: "Deep insights into team performance, customer satisfaction, and volume trends.",
            icon: "ri-bar-chart-grouped-line",
            color: "#f59e0b"
        },
        {
            title: "Organization Hub",
            desc: "Manage multiple organizations, brands, and custom departments from a single login.",
            icon: "ri-building-line",
            color: "#10b981"
        },
        {
            title: "Admin Dashboard",
            desc: "Granular control over settings, permissions, and security across your entire platform.",
            icon: "ri-shield-user-line",
            color: "#0a2a3a"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen pt-32 pb-20 px-6 bg-[#f8fbff]">
            <div className="max-w-6xl mx-auto">
                <div className="feature-header text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[#0a2a3a] mb-6 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
                        Platform <span className="text-[#04b8ff]">Capabilities</span>
                    </h1>
                    <p className="text-lg text-[#4a6070] max-w-2xl mx-auto leading-relaxed">
                        Everything you need to deliver world-class customer support at scale. 
                        Powered by AI, built for humans.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featureList.map((f, i) => (
                        <div 
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            className="bg-white p-8 rounded-3xl border border-[#04b8ff]/10 shadow-[0_4px_24px_rgba(4,184,255,0.05)] hover:shadow-[0_12px_40px_rgba(4,184,255,0.12)] transition-all duration-300 group"
                        >
                            <div 
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                style={{ background: `${f.color}15`, color: f.color }}
                            >
                                <i className={`${f.icon} text-2xl`}></i>
                            </div>
                            <h3 className="text-xl font-bold text-[#0a2a3a] mb-3 leading-tight">{f.title}</h3>
                            <p className="text-[14px] text-[#4a6070] leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
