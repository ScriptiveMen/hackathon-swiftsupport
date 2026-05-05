import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient.js";

export default function AdminLogin() {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginForm.email) newErrors.email = "Email is required";
    if (!loginForm.password) newErrors.password = "Password is required";
    setFieldErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

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
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "agent") {
        navigate("/agent", { replace: true });
      } else {
        // If a customer tries to log in here, we redirect them to customer portal or show error
        // Let's redirect to customer portal just in case
        navigate("/chat", { replace: true });
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((errItem) => {
          backendErrors[errItem.path] = errItem.msg;
        });
        setFieldErrors(backendErrors);
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── reusable styles ──────────────────────────────────── */
  const inputCls =
    "w-full bg-white border border-indigo-200 rounded-lg pl-10 pr-3 py-2.5 " +
    "text-[13.5px] text-gray-800 placeholder-gray-400 outline-none " +
    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition shadow-sm";

  const labelCls =
    "text-[10.5px] font-semibold tracking-widest text-indigo-800 uppercase";

  /* ── icons ────────────────────────────────────────────── */
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

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-[Inter,sans-serif]"
      style={{
        background: "linear-gradient(145deg, #e0e7ff 0%, #c7d2fe 100%)",
      }}
    >
      {/* ── Ambient blobs ── */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "#4f46e5", opacity: 0.15, filter: "blur(120px)" }}
      />
      <div
        className="absolute bottom-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "#818cf8", opacity: 0.2, filter: "blur(100px)" }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] px-4 py-8">
        {/* ── Header ── */}
        <div className="flex gap-6 flex-col items-center mb-5">
          <h1 className="text-[32px] font-[900] leading-1 text-indigo-950 tracking-tight mb-2">
            Staff Portal
          </h1>
          <p className="text-[13px] text-indigo-700 text-center">
            Secure access for SwiftSupport Admins and Agents
          </p>
        </div>

        {/* ── Card ── */}
        <div className="w-full bg-white/90 backdrop-blur-xl border border-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-indigo-50 bg-indigo-50/50">
            <h2 className="text-lg font-bold text-indigo-900">Sign In</h2>
            <p className="text-xs text-indigo-600 mt-1">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[12.5px] text-red-500">
              {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          <form
            onSubmit={handleLogin}
            className="px-6 py-6 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Email Address</label>
              <div className="relative flex items-center">
                <span
                  className={`absolute left-3 ${fieldErrors.email ? "text-red-400" : "text-indigo-400"}`}
                >
                  <MailIcon />
                </span>
                <input
                  className={`${inputCls} ${fieldErrors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  type="email"
                  placeholder="admin@swiftsupport.com"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, email: e.target.value });
                    if (fieldErrors.email)
                      setFieldErrors({ ...fieldErrors, email: "" });
                  }}
                />
              </div>
              {fieldErrors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Password</label>
              <div className="relative flex items-center">
                <span
                  className={`absolute left-3 ${fieldErrors.password ? "text-red-400" : "text-indigo-400"}`}
                >
                  <LockIcon />
                </span>
                <input
                  className={`${inputCls} ${fieldErrors.password ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  type="password"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                    if (fieldErrors.password)
                      setFieldErrors({ ...fieldErrors, password: "" });
                  }}
                />
              </div>
              {fieldErrors.password && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-lg font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all
                         bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow" />
                  Authenticating...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          {/* ── Card footer ── */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span>System Online</span>
            </div>
            <a
              href="/admin-register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create Admin Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
