import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Pricing = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".pricing-header", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });
            gsap.from(cardsRef.current, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2,
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const plans = [
        {
            name: "Starter",
            price: "29",
            desc: "Perfect for growing teams and startups.",
            features: ["Up to 3 Agents", "Unlimited Tickets", "Basic AI Automation", "Email Support", "Core Analytics"],
            popular: false,
            color: "#0a2a3a"
        },
        {
            name: "Professional",
            price: "79",
            desc: "The complete solution for scaling operations.",
            features: ["Up to 15 Agents", "Priority Ticketing", "Advanced AI Models", "Live Chat Widget", "Full Analytics", "Integration Hub"],
            popular: true,
            color: "#04b8ff"
        },
        {
            name: "Enterprise",
            price: "199",
            desc: "Custom power for large-scale global support.",
            features: ["Unlimited Agents", "Custom AI Training", "SLA Guarantees", "24/7 Dedicated Manager", "Whitelabeling", "SSO & Advanced Security"],
            popular: false,
            color: "#0077cc"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen pt-32 pb-20 px-6 bg-[#f8fbff]">
            <div className="max-w-6xl mx-auto">
                <div className="pricing-header text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[#0a2a3a] mb-6 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
                        Simple, <span className="text-[#04b8ff]">Scalable</span> Pricing
                    </h1>
                    <p className="text-lg text-[#4a6070] max-w-2xl mx-auto">
                        Choose the plan that's right for your business. No hidden fees, no complicated contracts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((p, i) => (
                        <div 
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            className={`relative bg-white rounded-[32px] p-10 border transition-all duration-500 ${
                                p.popular 
                                ? "border-[#04b8ff] shadow-[0_20px_60px_rgba(4,184,255,0.15)] scale-105 z-10" 
                                : "border-[#04b8ff]/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
                            }`}
                        >
                            {p.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#04b8ff] text-white px-5 py-1.5 rounded-full text-[12px] font-bold tracking-wider uppercase">
                                    Most Popular
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-bold text-[#0a2a3a] mb-2">{p.name}</h3>
                            <p className="text-[14px] text-[#4a6070] mb-8 leading-relaxed h-12">{p.desc}</p>
                            
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-[#0a2a3a] tracking-tight">${p.price}</span>
                                <span className="text-[#4a6070] text-lg">/mo</span>
                            </div>

                            <div className="space-y-4 mb-10">
                                {p.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#04b8ff]/10 flex items-center justify-center flex-shrink-0">
                                            <i className="ri-check-line text-[12px] text-[#04b8ff] font-bold"></i>
                                        </div>
                                        <span className="text-[14px] text-[#4a6070] font-medium">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 ${
                                    p.popular
                                    ? "bg-[#04b8ff] text-white shadow-[0_8px_20px_rgba(4,184,255,0.3)] hover:shadow-[0_12px_30px_rgba(4,184,255,0.4)] hover:-translate-y-1"
                                    : "bg-[#0a2a3a] text-white hover:bg-[#1a3a4a] hover:-translate-y-1"
                                }`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-center mt-12 text-[#4a6070] text-[13px] font-medium">
                    All plans include a 14-day free trial. No credit card required.
                </p>
            </div>
        </div>
    );
};

export default Pricing;
