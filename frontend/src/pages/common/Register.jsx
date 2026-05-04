import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const orgs = ["Acme Corp", "TechNova", "GlobalSoft", "Nexus Labs"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axiosClient.post("/register", form);

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── shared styles ── */
  const inp = {
    width: "100%", padding: "10px 12px 10px 38px", border: "1.5px solid rgba(11,186,255,0.3)",
    borderRadius: "10px", fontSize: "13.5px", color: "#1e3a4a", background: "rgba(255,255,255,0.9)",
    outline: "none", boxSizing: "border-box", fontFamily: "'Inter',sans-serif", transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const focus = (e) => { e.target.style.borderColor = "#04b8ff"; e.target.style.boxShadow = "0 0 0 3px rgba(4,184,255,0.12)"; };
  const blur  = (e) => { e.target.style.borderColor = "rgba(11,186,255,0.3)"; e.target.style.boxShadow = "none"; };
  const lbl   = { fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.1em", color: "#4a6070", textTransform: "uppercase", display: "block", marginBottom: "5px" };

  const Icon = ({ d, viewBox = "0 0 24 24" }) => (
    <svg width="15" height="15" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {typeof d === "string" ? <path d={d} /> : d}
    </svg>
  );

  const Field = ({ label, icon, error, children }) => (
    <div style={{ marginBottom: "14px" }}>
      <label style={lbl}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#7aaabb", display: "flex" }}>{icon}</span>
        {children}
      </div>
      {error && <span style={{ display:"block", fontSize:"11px", color:"#ef4444", marginTop:"4px", fontWeight:500 }}>{error}</span>}
    </div>
  );

  if (success) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg,#e8f6ff 0%,#cceeff 40%,#a8e0ff 100%)", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderRadius: "20px", padding: "48px 40px", textAlign: "center", maxWidth: "400px", width: "90%", boxShadow: "0 8px 48px rgba(4,184,255,0.18)", border: "1px solid rgba(11,186,255,0.25)" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#04b8ff,#0072c6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 6px 20px rgba(4,184,255,0.4)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: "22px", fontWeight: 800, color: "#0a2a3a" }}>You're in!</h2>
        <p style={{ margin: "0 0 28px", fontSize: "13.5px", color: "#4a6070", lineHeight: 1.6 }}>
          Your account has been created. The admin team can now see your profile in the Customers panel.
        </p>
        <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(90deg,#04b8ff,#0072c6)", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 18px rgba(4,184,255,0.35)" }}>
          Go to Login
        </button>
      </div>
    </div>
  );




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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-100 text-green-600 p-2 rounded mb-3 text-sm">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span 
            onClick={() => navigate("/login")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
