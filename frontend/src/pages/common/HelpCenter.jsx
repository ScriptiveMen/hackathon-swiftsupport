import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const HelpCenter = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [activeSection, setActiveSection] = useState("platform-overview");

    const sections = [
        {
            group: "GETTING STARTED",
            items: [
                { id: "platform-overview", label: "Platform Overview", icon: "ri-global-line" },
                { id: "account-creation", label: "Account Creation", icon: "ri-user-add-line" },
                { id: "initial-configuration", label: "Initial Configuration", icon: "ri-settings-4-line" }
            ]
        },
        {
            group: "ADMINISTRATION",
            items: [
                { id: "organization-settings", label: "Organization Settings", icon: "ri-building-line" },
                { id: "managing-agents", label: "Managing Agents", icon: "ri-team-line" },
                { id: "roles-permissions", label: "Roles & Permissions", icon: "ri-shield-keyhole-line" }
            ]
        },
        {
            group: "CORE FEATURES",
            items: [
                { id: "customer-chat-flow", label: "Customer Chat Flow", icon: "ri-chat-smile-3-line" },
                { id: "ticket-life-cycle", label: "Ticket Life Cycle", icon: "ri-ticket-2-line" },
                { id: "ai-configuration", label: "AI Configuration", icon: "ri-robot-line" }
            ]
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Entrance animation
        const ctx = gsap.context(() => {
            gsap.from(".docs-sidebar", {
                x: -40,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });
            gsap.from(".docs-content-area", {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power4.out",
                delay: 0.2
            });
        }, containerRef);

        // Intersection Observer for scroll spying
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sectionElements = document.querySelectorAll('.doc-section');
        sectionElements.forEach(section => observer.observe(section));

        return () => {
            ctx.revert();
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; // Accounts for fixed header and spacing
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f8fbff] flex">
            {/* Fixed Sidebar */}
            <aside className="docs-sidebar fixed top-0 left-0 h-screen w-72 bg-white border-r border-[#04b8ff]/10 pt-28 px-6 overflow-y-auto z-40 hidden lg:block">
                <div className="space-y-6 pb-20">
                    {sections.map((group, i) => (
                        <div key={i}>
                            <h4 className="text-[10px] font-black text-[#04b8ff] uppercase tracking-[0.2em] mb-3 px-3 opacity-80">
                                {group.group}
                            </h4>
                            <div className="space-y-0.5">
                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-semibold transition-all duration-300 group ${
                                            activeSection === item.id 
                                            ? "bg-[#04b8ff]/10 text-[#04b8ff] shadow-sm" 
                                            : "text-[#5a7a8a] hover:bg-[#f0f9ff] hover:text-[#04b8ff]"
                                        }`}
                                    >
                                        <i className={`${item.icon} text-base ${activeSection === item.id ? "text-[#04b8ff]" : "text-[#7aaabb] group-hover:text-[#04b8ff]"}`}></i>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="docs-content-area flex-1 lg:ml-72 pt-32 pb-32 px-6 md:px-12 lg:px-20">
                <div className="max-w-4xl mx-auto">
                    
                    {/* GETTING STARTED */}
                    <div className="mb-24">
                        <section id="platform-overview" className="doc-section mb-20 scroll-mt-32">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#04b8ff]/10 text-[#04b8ff] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <i className="ri-information-line"></i> Getting Started
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#0a2a3a] mb-8 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
                                Platform <span className="text-[#04b8ff]">Overview</span>
                            </h1>
                            <div className="prose prose-lg text-[#4a6070] max-w-none space-y-6">
                                <p className="text-lg leading-relaxed">
                                    SwiftSupport is a next-generation customer service infrastructure designed to bridge the gap between 
                                    automated efficiency and human empathy. Our platform provides a unified environment where 
                                    AI agents and human representatives collaborate seamlessly to resolve customer issues.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                    <div className="bg-white p-6 rounded-2xl border border-[#04b8ff]/10 shadow-sm">
                                        <h4 className="text-[#0a2a3a] font-bold mb-2">Hybrid Intelligence</h4>
                                        <p className="text-[14px]">Advanced NLP models that handle 80% of routine queries, escalating only the complex cases to your staff.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-[#04b8ff]/10 shadow-sm">
                                        <h4 className="text-[#0a2a3a] font-bold mb-2">Unified Dashboard</h4>
                                        <p className="text-[14px]">A single source of truth for all customer interactions, whether they happened via chat, email, or tickets.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="account-creation" className="doc-section mb-20 scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">Account Creation</h2>
                            <div className="space-y-8">
                                <p className="text-[#4a6070] leading-relaxed">
                                    Every journey on SwiftSupport begins with a structured onboarding process tailored to your specific role. 
                                    We enforce strict role-based access control (RBAC) to ensure data security and operational clarity.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-5 p-6 bg-white rounded-2xl border border-[#04b8ff]/10 group hover:border-[#04b8ff]/30 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-[#04b8ff] text-white flex items-center justify-center flex-shrink-0 font-black text-xl shadow-lg shadow-[#04b8ff]/20">1</div>
                                        <div>
                                            <h4 className="font-bold text-[#0a2a3a] mb-2">Admin Registration</h4>
                                            <p className="text-[14.5px] text-[#4a6070]">Visit the <b>Admin Register</b> page to create your Organization profile. As the first user, you will be assigned the <i>Owner</i> role with full system permissions.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 p-6 bg-white rounded-2xl border border-[#04b8ff]/10 group hover:border-[#04b8ff]/30 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-[#0a2a3a] text-white flex items-center justify-center flex-shrink-0 font-black text-xl">2</div>
                                        <div>
                                            <h4 className="font-bold text-[#0a2a3a] mb-2">Customer Signup</h4>
                                            <p className="text-[14.5px] text-[#4a6070]">Existing organizations provide a specialized portal for their users. Customers must select their specific organization from the dropdown during registration to be correctly routed.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="initial-configuration" className="doc-section mb-20 scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">Initial Configuration</h2>
                            <p className="text-[#4a6070] leading-relaxed mb-8">
                                Once your account is active, you must configure the core system parameters to align with your business logic. 
                                This setup determines how the AI behaves and how tickets are distributed.
                            </p>
                            <div className="bg-[#0a2a3a] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#04b8ff] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                    <div className="space-y-2">
                                        <div className="text-[#04b8ff] font-black text-xs uppercase tracking-widest">Step 01</div>
                                        <h5 className="font-bold">Define Workflows</h5>
                                        <p className="text-xs text-white/60">Set business hours and automated response templates.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[#04b8ff] font-black text-xs uppercase tracking-widest">Step 02</div>
                                        <h5 className="font-bold">KB Ingestion</h5>
                                        <p className="text-xs text-white/60">Upload your existing FAQs and help articles for AI training.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[#04b8ff] font-black text-xs uppercase tracking-widest">Step 03</div>
                                        <h5 className="font-bold">Agent Invite</h5>
                                        <p className="text-xs text-white/60">Onboard your human support team and assign departments.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ADMINISTRATION */}
                    <div className="mb-24">
                        <div className="h-px w-full bg-[#04b8ff]/10 mb-20"></div>
                        <section id="organization-settings" className="doc-section mb-20 scroll-mt-32">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <i className="ri-shield-user-line"></i> Administration
                            </div>
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">Organization Settings</h2>
                            <p className="text-[#4a6070] leading-relaxed mb-6">
                                The Organization settings tab allows you to manage your global profile, branding, and billing details. 
                                Changes made here apply across all agent and customer portals associated with your ID.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                {["Custom Branding & Logos", "Custom Domain Mapping", "Notification Preferences", "Audit Logs & Security"].map((txt, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[14px] text-[#5a7a8a] bg-white p-4 rounded-xl border border-[#04b8ff]/5">
                                        <i className="ri-checkbox-circle-fill text-[#04b8ff]"></i> {txt}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section id="managing-agents" className="doc-section mb-20 scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">Managing Agents</h2>
                            <p className="text-[#4a6070] leading-relaxed mb-8">
                                Efficient support requires a well-structured team. The Agent Management module provides a granular view 
                                of your staff's performance, status, and workload.
                            </p>
                            <div className="bg-white rounded-2xl border border-[#04b8ff]/10 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-[#04b8ff]/5 bg-[#f0f9ff]/50">
                                    <h5 className="font-bold text-[#0a2a3a] text-sm">Best Practices for Agent Onboarding</h5>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex gap-4">
                                        <i className="ri-user-follow-line text-[#04b8ff]"></i>
                                        <p className="text-[14px] text-[#4a6070]">Assign agents to specific departments (Billing, Tech, Sales) for automatic routing.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <i className="ri-pulse-line text-[#04b8ff]"></i>
                                        <p className="text-[14px] text-[#4a6070]">Monitor 'Active' vs 'Inactive' status to prevent ticket bottlenecks.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="roles-permissions" className="doc-section mb-20 scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">Roles & Permissions</h2>
                            <p className="text-[#4a6070] leading-relaxed mb-8">
                                SwiftSupport uses a tiered permission system to maintain data integrity. You can assign 
                                specific capabilities based on staff seniority and responsibility.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-white border border-[#04b8ff]/10">
                                    <span className="text-[10px] font-black text-[#04b8ff] uppercase tracking-widest">Admin</span>
                                    <h6 className="font-bold text-[#0a2a3a] mt-1">Full Access</h6>
                                    <p className="text-[12px] text-[#5a7a8a] mt-2">Manage all settings, agents, and billing.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white border border-[#04b8ff]/10">
                                    <span className="text-[10px] font-black text-[#6366f1] uppercase tracking-widest">Agent</span>
                                    <h6 className="font-bold text-[#0a2a3a] mt-1">Chat & Tickets</h6>
                                    <p className="text-[12px] text-[#5a7a8a] mt-2">Access to customer support tools and FAQ editor.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white border border-[#04b8ff]/10">
                                    <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Customer</span>
                                    <h6 className="font-bold text-[#0a2a3a] mt-1">Self-Service</h6>
                                    <p className="text-[12px] text-[#5a7a8a] mt-2">View own tickets and chat with support.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* CORE FEATURES */}
                    <div className="mb-24">
                        <div className="h-px w-full bg-[#04b8ff]/10 mb-20"></div>
                        <section id="customer-chat-flow" className="doc-section mb-20 scroll-mt-32">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ec4899]/10 text-[#ec4899] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <i className="ri-flashlight-line"></i> Core Features
                            </div>
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">Customer Chat Flow</h2>
                            <p className="text-[#4a6070] leading-relaxed mb-8">
                                Our chat system is built for speed and reliability. Here is the lifecycle of a typical interaction:
                            </p>
                            <div className="space-y-6">
                                {[
                                    { t: "Initiation", d: "Customer sends a message via the dashboard chat widget." },
                                    { t: "AI Analysis", d: "AI parses the intent and provides an instant FAQ-based response." },
                                    { t: "Escalation", d: "If the AI cannot resolve it, the customer is prompted to 'Talk to Agent'." },
                                    { t: "Human Takeover", d: "A live ticket is created and assigned to the next available agent." },
                                    { t: "Resolution", d: "The agent resolves the issue and closes the ticket for archiving." }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 items-start">
                                        <div className="w-8 h-8 rounded-full bg-[#04b8ff]/10 text-[#04b8ff] flex items-center justify-center flex-shrink-0 text-xs font-bold">0{idx+1}</div>
                                        <div>
                                            <h6 className="font-bold text-[#0a2a3a] text-[15px]">{step.t}</h6>
                                            <p className="text-[14px] text-[#4a6070]">{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="ticket-life-cycle" className="doc-section mb-20 scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">Ticket Life Cycle</h2>
                            <p className="text-[#4a6070] leading-relaxed mb-8">
                                Every unresolved chat becomes a formal ticket. This ensures no customer query is ever dropped or forgotten. 
                                Tickets move through several statuses:
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="px-6 py-4 rounded-2xl bg-red-50 border border-red-100 flex-1 min-w-[200px]">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Pending</span>
                                    <p className="text-[12px] text-red-700/70 mt-1">Newly created, waiting for agent acceptance.</p>
                                </div>
                                <div className="px-6 py-4 rounded-2xl bg-blue-50 border border-blue-100 flex-1 min-w-[200px]">
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Open</span>
                                    <p className="text-[12px] text-blue-700/70 mt-1">Agent is currently working on the resolution.</p>
                                </div>
                                <div className="px-6 py-4 rounded-2xl bg-green-50 border border-green-100 flex-1 min-w-[200px]">
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Resolved</span>
                                    <p className="text-[12px] text-green-700/70 mt-1">Issue fixed and customer satisfied.</p>
                                </div>
                            </div>
                        </section>

                        <section id="ai-configuration" className="doc-section mb-20 scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6 tracking-tight">AI Configuration</h2>
                            <p className="text-[#4a6070] leading-relaxed mb-8">
                                You have total control over your AI's personality and knowledge base. Using the FAQ module, 
                                you can train the model on specific business rules.
                            </p>
                            <div className="bg-gradient-to-br from-[#04b8ff] to-[#0077cc] rounded-3xl p-8 text-white">
                                <h5 className="font-bold mb-4 flex items-center gap-2">
                                    <i className="ri-magic-line"></i> Pro Tip: AI Training
                                </h5>
                                <p className="text-[14.5px] text-white/80 leading-relaxed">
                                    Regularly audit your 'Failed Intent' logs to see where customers are asking questions 
                                    your AI doesn't know yet. Adding just 5-10 FAQs a week can improve automation rates by 40%!
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Footer for Docs */}
                    <footer className="pt-20 border-t border-[#04b8ff]/10 text-center">
                        <p className="text-[14px] text-[#7aaabb] mb-4">Still need help?</p>
                        <button 
                            onClick={() => window.location.href = "mailto:support@swiftsupport.com"}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white border border-[#04b8ff]/20 text-[#0a2a3a] font-bold hover:bg-[#f0f9ff] transition-all"
                        >
                            <i className="ri-mail-send-line text-[#04b8ff]"></i> Contact Technical Support
                        </button>
                    </footer>
                </div>
            </main>

            {/* Injected Styles for specialized Docs layout */}
            <style>{`
                html {
                    scroll-behavior: smooth;
                }
                .docs-sidebar::-webkit-scrollbar {
                    width: 5px;
                }
                .docs-sidebar::-webkit-scrollbar-track {
                    background: #f8fbff;
                }
                .docs-sidebar::-webkit-scrollbar-thumb {
                    background: #e2eef8;
                    border-radius: 10px;
                }
                .docs-sidebar::-webkit-scrollbar-thumb:hover {
                    background: #04b8ff30;
                }
                .doc-section {
                    transition: opacity 0.3s ease;
                }
                @media (max-width: 1024px) {
                    .docs-sidebar {
                        display: none;
                    }
                    .docs-content-area {
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default HelpCenter;
