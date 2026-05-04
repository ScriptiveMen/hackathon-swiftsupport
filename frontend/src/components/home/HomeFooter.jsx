import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap", "Integrations"],
  Company: ["About Us", "Careers", "Blog", "Press", "Partners"],
  Resources: [
    "Documentation",
    "API Reference",
    "Status Page",
    "Community",
    "Support Center",
  ],
  Legal: [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "GDPR",
    "Security",
  ],
};

const socials = [
  { name: "Twitter", icon: <i className="ri-twitter-x-line"></i> },
  { name: "LinkedIn", icon: <i className="ri-linkedin-box-line"></i> },
  { name: "GitHub", icon: <i className="ri-github-line"></i> },
  { name: "YouTube", icon: <i className="ri-youtube-line"></i> },
];

export default function HomeFooter() {
  const navigate = useNavigate();
  const footerRef = useRef(null);
  const bigTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple Y-axis slide up animation
      gsap.fromTo(
        bigTextRef.current,
        {
          opacity: 0,
          y: 140,
        },
        {
          opacity: 1,
          y: 0,
          delay: 0.5,
          duration: 1.9,
          ease: "power4.out",
          stagger: 0.5,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden pt-16 pb-8 border-t"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(4,184,255,0.12)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Remix Icons & Google Fonts */}
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
        rel="stylesheet"
      />
      {/* <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap" rel="stylesheet" /> */}

      {/* Large Animated Title - Responsive & Horizontal */}
      <div className="w-full px-4 mb-10 select-none overflow-hidden">
        <h1
          ref={bigTextRef}
          className="text-[8vw] lg:text-[15vw] font-extrabold leading-none text-center tracking-[-0.04em]"
          style={{
            fontFamily: "'Switzer Extrabold', sans-serif",
            background: "linear-gradient(180deg, #0a2a3a 0%, #04b8ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            textTransform: "capitalize",
            opacity: 0.95,
          }}
        >
          <span>Swift</span> <span>Support</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 footer-content relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="footer-col col-span-2 flex flex-col gap-6">
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #04b8ff, #0077cc)",
                  boxShadow: "0 4px 16px rgba(4,184,255,0.25)",
                }}
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="white">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-[19px] font-bold text-[#0a2a3a] tracking-tight">
                SwiftSupport
              </span>
            </div>

            <p className="text-[14px] text-[#5a7a8a] leading-relaxed max-w-[280px]">
              Empowering modern teams with AI-first customer support. Build
              faster, support better, grow stronger.
            </p>

            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-[#04b8ff]/10 text-[#5a7a8a] hover:text-[#04b8ff] hover:border-[#04b8ff]/30 transition-all shadow-sm"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="footer-col flex flex-col gap-5">
              <h4 className="text-[12px] font-bold text-[#0a2a3a] uppercase tracking-[0.15em]">
                {group}
              </h4>
              <div className="flex flex-col gap-3.5">
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[14px] text-[#5a7a8a] hover:text-[#04b8ff] transition-all"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-[#04b8ff]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <p className="text-[13px] text-[#7aaabb]">
              © 2026 SwiftSupport AI Inc.
            </p>
            <div className="hidden md:flex select-none items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-700 font-medium tracking-wide">
                SYSTEMS ONLINE
              </span>
            </div>
          </div>

          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[13px] text-[#7aaabb] hover:text-[#04b8ff] transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#04b8ff]/5 rounded-full blur-[100px] -z-0 pointer-events-none translate-y-1/2 translate-x-1/3" />
    </footer>
  );
}
