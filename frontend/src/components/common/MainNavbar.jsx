import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { StaggeredMenu } from "../home/StaggeredMenu";

import toast from "react-hot-toast";

const FONT = "'Switzer Extrabold', '  Inter', sans-serif";

export default function MainNavbar() {
  const navigate = useNavigate();

  // refs
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const ctaRef = useRef(null);

  const navLinks = ["Home", "Features", "Pricing", "Docs"];

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ── Desktop entrance animation ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
      )
        .fromTo(
          logoRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45 },
          "-=0.4",
        )
        .fromTo(
          linksRef.current,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          "-=0.3",
        )
        .fromTo(
          ctaRef.current,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45 },
          "-=0.35",
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
    const role = user?.role?.toLowerCase();
    if (role === "admin") navigate("/admin");
    else if (role === "agent") navigate("/agent");
    else navigate("/chat");
  };

  const getMobileMenuItems = () => {
    const mobileLinks = ["Home", "Features", "Pricing", "Docs"];
    const baseItems = mobileLinks.map((l) => ({ 
      label: l, 
      onClick: () => {
        if (l === "Home") navigate("/");
        else if (l === "Pricing") {
          toast.success("Pricing is coming soon! For now, SwiftSupport is 100% Free.", { icon: '🎁' });
        }
        else navigate(`/${l.toLowerCase()}`);
      } 
    }));

    if (!isLoggedIn) {
      baseItems.push({ label: "Login", onClick: () => navigate("/login") });
    } else {
      const role = user?.role?.toLowerCase();
      if (role === "admin" || role === "agent") {
        baseItems.push({ label: "Dashboard", onClick: handleDashboardRedirect });
      } else {
        baseItems.push({ label: "Chat", onClick: () => navigate("/chat") });
      }

      // Add special account item for the bottom section
      baseItems.push({
        isAccount: true,
        initials: getInitials(user?.name),
        name: user?.name,
        email: user?.email,
        onLogout: handleLogout
      });
    }
    return baseItems;
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed select-none top-0 left-0 right-0 z-50"
      >
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
                  background:
                    "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)",
                  boxShadow: "0 3px 12px rgba(4,184,255,0.45)",
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span
                className="text-[17px] font-bold text-[#0a2a3a] tracking-tight select-none"
                style={{
                  fontFamily: "'Switzer Extrabold', 'Inter', sans-serif",
                }}
              >
                SwiftSupport
              </span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link, i) => (
                <button
                  key={link}
                  ref={(el) => (linksRef.current[i] = el)}
                  onClick={() => {
                    if (link === "Home") navigate("/");
                    else if (link === "Pricing") {
                      toast.success("Pricing is coming soon! For now, SwiftSupport is 100% Free.", { icon: '🎁' });
                    }
                    else navigate(`/${link.toLowerCase()}`);
                  }}
                  onMouseEnter={(e) => handleLinkEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleLinkLeave(e.currentTarget)}
                  style={{
                    fontFamily: FONT,
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: "#4a6070",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "inline-block",
                    padding: 0,
                    willChange: "transform",
                  }}
                >
                  {link}
                </button>
              ))}
              {isLoggedIn && user?.role?.toLowerCase() === "customer" && (
                <button
                  onClick={() => navigate("/chat")}
                  onMouseEnter={(e) => handleLinkEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleLinkLeave(e.currentTarget)}
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
                    gap: "6px",
                  }}
                >
                  Chat
                </button>
              )}
              {isLoggedIn && (user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "agent") && (
                <button
                  onClick={handleDashboardRedirect}
                  onMouseEnter={(e) => handleLinkEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleLinkLeave(e.currentTarget)}
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
                    gap: "6px",
                  }}
                >
                  Dashboard
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
                      background:
                        "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)",
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    title="Profile Menu"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      background:
                        "linear-gradient(135deg, #04b8ff 0%, #0077cc 100%)",
                      boxShadow: "0 4px 16px rgba(4,184,255,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontFamily: FONT,
                      fontSize: "15px",
                      fontWeight: 700,
                      willChange: "transform",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(4,184,255,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(4,184,255,0.35)";
                    }}
                  >
                    {getInitials(user?.name)}
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={handleDashboardRedirect}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-[#04b8ff] rounded-md transition-colors"
                        >
                          {(user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "agent") ? "Dashboard" : "Chat"}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-md transition-colors mt-1"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                colors={["#e8f6ff", "#cceeff", "#ffffff"]}
                items={getMobileMenuItems()}
                displayItemNumbering={false}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
