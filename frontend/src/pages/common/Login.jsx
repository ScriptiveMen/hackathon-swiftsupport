import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient.js";


export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
    organizationName: "Acme Corp", 
  });
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const orgs = ["Acme Corp", "TechNova", "GlobalSoft", "Nexus Labs"];
  
  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.post("/auth/login", loginForm);
      if (!data.token) {
        throw new Error(data.message || "Login did not return an auth token");
      }

      localStorage.setItem("token", data.token);
      
      let finalUser = data.user;
      if (data.status && !data.user) {
        const userRes = await axiosClient.get("/auth/getUser");
        finalUser = userRes.data.data || userRes.data;
      }

      if (!finalUser) {
        throw new Error("Login did not return user details");
      }
      
      localStorage.setItem("user", JSON.stringify(finalUser));
      
      const role = finalUser.role?.toLowerCase();
      navigate(role === "admin" ? "/admin" : role === "agent" ? "/agent" : "/", { replace: true });
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.post("/auth/register", signupForm);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      const role = data.user.role?.toLowerCase();
      navigate(role === "admin" ? "/admin" : role === "agent" ? "/agent" : "/", { replace: true });
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };




  /* ── reusable styles ──────────────────────────────────── */
  const inputCls =
    "w-full bg-white border border-[#0bbaff]/30 rounded-lg pl-10 pr-3 py-2.5 " +
    "text-[13.5px] text-[#1e3a4a] placeholder-[#9bbccc] outline-none " +
    "focus:border-[#04b8ff] focus:ring-2 focus:ring-[#04b8ff]/15 transition shadow-sm";

  const labelCls =
    "text-[10.5px] font-semibold tracking-widest text-[#4a6070] uppercase";

  /* ── icons ────────────────────────────────────────────── */
  const UserIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  const MailIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
  const LockIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
  const BriefIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
  const BoltIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
    </svg>
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-[Inter,sans-serif]"
      style={{
        background:
          "linear-gradient(145deg, #e8f6ff 0%, #cceeff 40%, #a8e0ff 100%)",
      }}
    >
      {/* ── Ambient blobs using palette colours ── */}
      {/* #0BBAFF at 12% opacity — large soft wash */}
      <div
        className="blob-drift absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "#0bbaff", opacity: 0.12, filter: "blur(491px)" }}
      />

      {/* #6ED6FF at 100% opacity — mid blob */}
      <div
        className="blob-drift-2 absolute bottom-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "#6ed6ff", opacity: 1, filter: "blur(364px)" }}
      />

      {/* #04B8FF at 100% opacity — sharp accent blob */}
      <div
        className="absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "#04b8ff", opacity: 1, filter: "blur(248px)" }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[460px] px-4 py-8">
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 mb-9">
          {/* <div
            className="w-[44px] h-[44px] rounded-[11px] flex items-center justify-center
                          bg-gradient-to-br from-[#04b8ff] to-[#0077cc]
                          shadow-[0_4px_20px_rgba(4,184,255,0.45)]"
          >
            <BoltIcon />
          </div> */}
          <h1 className="text-[40px] font-[Switzer_Extrabold] font-[900] flex leading-1 text-[#0a2a3a] tracking-normal">
            Swift Support 
          </h1>
        </div>
        <p className="text-[13px] text-[#4a7a8a] text-center leading-relaxed mb-6">
          Precision engineering for high-
          <br />
          performance AI customer ecosystems.
        </p>

        {/* ── Card ── */}
        <div
          className="w-full bg-white/80 backdrop-blur-xl border border-[#0bbaff]/25 rounded-2xl overflow-hidden
                        shadow-[0_8px_48px_rgba(4,184,255,0.18),0_1px_0_rgba(255,255,255,0.9)_inset]"
        >
          {/* Tabs */}
          <div className="flex border-b border-[#0bbaff]/15">
            {["signup", "login"].map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className={`flex-1 py-3.5 text-[14px] font-medium transition relative capitalize
                  ${
                    activeTab === tab
                      ? "text-[#04b8ff]"
                      : "text-[#7aaabb] hover:text-[#1e6a8a]"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-t-sm
                                   bg-gradient-to-r from-[#04b8ff] to-[#6ed6ff]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mx-7 mt-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg
                            text-[12.5px] text-red-500"
            >
              {error}
            </div>
          )}

          {/* ── SIGNUP FORM ── */}
          {activeTab === "signup" && (
            <form
              onSubmit={handleSignup}
              className="px-7 pt-6 pb-2 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Full Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#7aaabb]">
                    <UserIcon />
                  </span>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="John Doe"
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#7aaabb]">
                    <MailIcon />
                  </span>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="john@nexus.ai"
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#7aaabb]">
                    <LockIcon />
                  </span>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="Min. 6 characters"
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>System Role</label>
                <div className="flex gap-2">
                  {["Customer", "Agent", "Admin"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSignupForm({ ...signupForm, role })}
                      className={`flex-1 py-2 rounded-lg text-[13px] font-medium border transition
                        ${
                          signupForm.role === role
                            ? "bg-[#04b8ff]/10 border-[#04b8ff] text-[#0090cc] shadow-[0_0_0_3px_rgba(4,184,255,0.12)]"
                            : "bg-white border-[#cce8f4] text-[#5a7a8a] hover:border-[#04b8ff]/50 hover:text-[#0090cc]"
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Select Organization</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#7aaabb]">
                    <BriefIcon />
                  </span>
                  <select
                    value={signupForm.organizationName}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        organizationName: e.target.value,
                      })
                    }

                    className="w-full bg-white border border-[#0bbaff]/30 rounded-lg pl-10 pr-8 py-2.5
                               text-[13.5px] text-[#1e3a4a] outline-none appearance-none cursor-pointer
                               focus:border-[#04b8ff] focus:ring-2 focus:ring-[#04b8ff]/15 transition shadow-sm"
                  >
                    {orgs.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 text-[#7aaabb] text-xs pointer-events-none">
                    ▾
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 rounded-lg font-semibold text-[14px] text-white flex items-center
                           justify-center gap-2 transition-all
                           bg-gradient-to-r from-[#04b8ff] to-[#0077cc]
                           shadow-[0_4px_18px_rgba(4,184,255,0.35)]
                           hover:shadow-[0_6px_26px_rgba(4,184,255,0.5)] hover:-translate-y-0.5
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow" />
                    Initializing Deployment...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-[12.5px] text-[#5a7a8a] pb-1">
                Already have an account?{" "}
                <span
                  onClick={() => switchTab("login")}
                  className="text-[#04b8ff] font-semibold cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </form>
          )}

          {/* ── LOGIN FORM ── */}
          {activeTab === "login" && (
            <form
              onSubmit={handleLogin}
              className="px-7 pt-6 pb-2 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#7aaabb]">
                    <MailIcon />
                  </span>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="john@nexus.ai"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#7aaabb]">
                    <LockIcon />
                  </span>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="Min. 6 characters"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 rounded-lg font-semibold text-[14px] text-white flex items-center
                           justify-center gap-2 transition-all
                           bg-gradient-to-r from-[#04b8ff] to-[#0077cc]
                           shadow-[0_4px_18px_rgba(4,184,255,0.35)]
                           hover:shadow-[0_6px_26px_rgba(4,184,255,0.5)] hover:-translate-y-0.5
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow" />
                    Authenticating...
                  </>
                ) : (
                  "Access System"
                )}
              </button>

              <p className="text-center text-[12.5px] text-[#5a7a8a] pb-1">
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => switchTab("signup")}
                  className="text-[#04b8ff] font-semibold cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </p>
            </form>
          )}

          {/* ── Card footer ── */}
          <div className="px-7 pt-4 pb-5 flex flex-col items-center gap-3">
            <div className="w-full flex items-center gap-3">
              <span className="flex-1 h-px bg-[#0bbaff]/15" />
              <span className="text-[10px] text-[#7aaabb] tracking-wider whitespace-nowrap">
                Secure Authentication Engine
              </span>
              <span className="flex-1 h-px bg-[#0bbaff]/15" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse-dot" />
              <span className="text-[9.5px] font-semibold tracking-[0.12em] text-[#7aaabb] uppercase">
                Instance Status: Ready
              </span>
            </div>
          </div>
        </div>

        {/* ── Page footer ── */}
        <div className="flex gap-7 mt-6 text-[10px] tracking-widest text-[#7aaabb] font-medium uppercase">
          {["Privacy Protocol", "System Status", "V4.2.0-Alpha"].map((f) => (
            <span
              key={f}
              className="hover:text-[#0090cc] cursor-pointer transition"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
