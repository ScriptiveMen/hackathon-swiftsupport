import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { StaggeredMenu } from "./StaggeredMenu";



const FONT = "'Switzer Extrabold', '  Inter', sans-serif";

export default function HomeNavbar() {
  const navigate = useNavigate();

  // refs
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const ctaRef = useRef(null);

  const navLinks = ["Features", "Pricing", "Docs", "Blog"];

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // ── Desktop entrance animation ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 }
      )
        .fromTo(
          logoRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45 },
          "-=0.4"
        )
        .fromTo(
          linksRef.current,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          "-=0.3"
        )
        .fromTo(
          ctaRef.current,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45 },
          "-=0.35"
        );
    });

    return () => ctx.revert();
  }, []);

  // ── Link hover — magnetic underline via GSAP ─────────────────────────────
  const handleLinkEnter = (el) => {
    gsap.to(el, {
      color: "#04b8ff",
      y: -2,
      duration: 0.22,
      ease: "power2.out",
    });
  };
  const handleLinkLeave = (el) => {
    gsap.to(el, {
      color: "#4a6070",
      y: 0,
      duration: 0.22,
      ease: "power2.out",
    });
  };

  const handleDashboardRedirect = () => {
    const role = user.role?.toLowerCase();
    if (role === "admin") navigate("/admin");
    else if (role === "agent") navigate("/agent");
    else navigate("/customer/chat");
  };

  return (
    <>
      <header ref={headerRef} className="fixed select-none top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl mt-3 px-4">
          <div
            className="flex items-center justify-between px-5 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(4,184,255,0.18)",
              boxShadow:
                "0 4px 32px rgba(4,184,255,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
            }}
          >
            {/* Logo */}
            <div
              ref={logoRef}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)",
                  boxShadow: "0 3px 12px rgba(4,184,255,0.45)",
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span
                className="text-[17px] font-bold text-[#0a2a3a] tracking-tight select-none"
                style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif" }}
              >
                SwiftSupport
              </span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link, i) => (
                <a
                  key={link}
                  href="#"
                  ref={(el) => (linksRef.current[i] = el)}
                  onMouseEnter={(e) => handleLinkEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleLinkLeave(e.currentTarget)}
                  style={{
                    fontFamily: FONT,
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: "#4a6070",
                    textDecoration: "none",
                    display: "inline-block",
                    willChange: "transform",
                  }}
                >
                  {link}
                </a>
              ))}
              {isLoggedIn && (
                <button
                  onClick={() => navigate("/customer/chat")}
                  style={{
                    fontFamily: FONT,
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "#04b8ff",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  Chat 
                </button>
              )}
            </nav>

            {/* Desktop CTA Buttons */}
            <div ref={ctaRef} className="hidden md:flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    style={{
                      fontFamily: FONT,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1e3a4a",
                      border: "1.5px solid rgba(4,184,255,0.45)",
                      background: "transparent",
                      padding: "6px 20px",
                      borderRadius: "999px",
                      cursor: "pointer",
                      transition: "color 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      gsap.to(e.currentTarget, {
                        color: "#04b8ff",
                        borderColor: "#04b8ff",
                        scale: 1.04,
                        duration: 0.2,
                        ease: "power2.out",
                      })
                    }
                    onMouseLeave={(e) =>
                      gsap.to(e.currentTarget, {
                        color: "#1e3a4a",
                        borderColor: "rgba(4,184,255,0.45)",
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out",
                      })
                    }
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    style={{
                      fontFamily: FONT,
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#fff",
                      padding: "7px 18px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      background: "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)",
                      boxShadow: "0 4px 16px rgba(4,184,255,0.35)",
                      willChange: "transform",
                    }}
                    onMouseEnter={(e) =>
                      gsap.to(e.currentTarget, {
                        y: -3,
                        boxShadow: "0 8px 24px rgba(4,184,255,0.45)",
                        duration: 0.2,
                        ease: "power2.out",
                      })
                    }
                    onMouseLeave={(e) =>
                      gsap.to(e.currentTarget, {
                        y: 0,
                        boxShadow: "0 4px 16px rgba(4,184,255,0.35)",
                        duration: 0.2,
                        ease: "power2.out",
                      })
                    }
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDashboardRedirect}
                  title="Go to Dashboard"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)",
                    boxShadow: "0 4px 16px rgba(4,184,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: FONT,
                    fontSize: "15px",
                    fontWeight: 700,
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, {
                      y: -2,
                      boxShadow: "0 6px 20px rgba(4,184,255,0.45)",
                      duration: 0.2,
                      ease: "power2.out",
                    })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      y: 0,
                      boxShadow: "0 4px 16px rgba(4,184,255,0.35)",
                      duration: 0.2,
                      ease: "power2.out",
                    })
                  }
                >
                  {getInitials(user.name)}
                </button>
              )}
            </div>

            {/* Hamburger / Close — mobile only */}
            <div className="md:hidden flex items-center justify-center text-[#1e3a4a]">
              <StaggeredMenu
                isFixed={true}
                hideLogo={true}
                position="right"
                menuButtonColor="#1e3a4a"
                openMenuButtonColor="#0a2a3a"
                accentColor="#04b8ff"
                colors={['#e8f6ff', '#cceeff', '#ffffff']}
                items={[
                  ...navLinks.map((l) => ({ label: l, link: "#" })),
                  isLoggedIn ? { label: "Dashboard", onClick: handleDashboardRedirect } : { label: "Login", link: "/login" }
                ]}
                displayItemNumbering={false}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
