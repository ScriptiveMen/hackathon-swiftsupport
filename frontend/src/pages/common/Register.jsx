import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.organizationName)
      newErrors.organizationName = "Organization Name is required";
    if (!form.name) newErrors.name = "Full Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^admin@[a-zA-Z0-9-]+\.com$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email =
          "Email format should be like admin@organization_name.com";
      }
    }
    if (!form.password) newErrors.password = "Password is required";
    if (form.password && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setError("");
    setSuccess(false);

    try {
      setLoading(true);

      const res = await axiosClient.post(`${baseUrl}/api/auth/registerAdmin`, form);

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        organizationName: "",
      });
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((errItem) => {
          backendErrors[errItem.path] = errItem.msg;
        });
        setFieldErrors(backendErrors);
      } else {
        setError(
          err.response?.data?.message || err.message || "Something went wrong",
        );
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

  if (success)
    return (
      <div
        className="min-h-screen flex items-center justify-center font-[Inter,sans-serif]"
        style={{
          background: "linear-gradient(145deg, #e0e7ff 0%, #c7d2fe 100%)",
        }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-10 text-center max-w-[400px] w-[90%] shadow-2xl border border-white">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/40">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="m-0 mb-2.5 text-[22px] font-[800] text-indigo-950">
            You're in!
          </h2>
          <p className="m-0 mb-7 text-[13.5px] text-indigo-700 leading-[1.6]">
            Your admin account and organization have been created.
          </p>
          <button
            onClick={() => navigate("/admin-login")}
            className="w-full p-3 rounded-xl border-none bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-[14px] font-[700] cursor-pointer shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform"
          >
            Go to Login
          </button>
        </div>
      </div>
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
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-[32px] font-[900] leading-1 text-indigo-950 tracking-tight mb-2">
            Admin Setup
          </h1>
          <p className="text-[13px] text-indigo-700 text-center">
            Create an organization and admin account
          </p>
        </div>

        {/* ── Card ── */}
        <div className="w-full bg-white/90 backdrop-blur-xl border border-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-indigo-50 bg-indigo-50/50">
            <h2 className="text-lg font-bold text-indigo-900">Sign Up</h2>
            <p className="text-xs text-indigo-600 mt-1">
              Fill in the details below to get started
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[12.5px] text-red-500">
              {error}
            </div>
          )}

          {/* ── SIGNUP FORM ── */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Organization Name</label>
              <div className="relative flex items-center">
                <span
                  className={`absolute left-3 ${fieldErrors.organizationName ? "text-red-400" : "text-indigo-400"}`}
                >
                  <BriefIcon />
                </span>
                <input
                  className={`${inputCls} ${fieldErrors.organizationName ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  type="text"
                  name="organizationName"
                  placeholder="e.g. Acme Corp"
                  value={form.organizationName}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.organizationName && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.organizationName}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Full Name</label>
              <div className="relative flex items-center">
                <span
                  className={`absolute left-3 ${fieldErrors.name ? "text-red-400" : "text-indigo-400"}`}
                >
                  <UserIcon />
                </span>
                <input
                  className={`${inputCls} ${fieldErrors.name ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.name && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.name}
                </span>
              )}
            </div>

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
                  name="email"
                  placeholder="admin@swiftsupport.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
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
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.password && (
                  <span className="text-xs text-red-500 font-medium">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className={labelCls}>Confirm</label>
                <div className="relative flex items-center">
                  <span
                    className={`absolute left-3 ${fieldErrors.confirmPassword ? "text-red-400" : "text-indigo-400"}`}
                  >
                    <LockIcon />
                  </span>
                  <input
                    className={`${inputCls} ${fieldErrors.confirmPassword ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="text-xs text-red-500 font-medium">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
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
                  Creating Account...
                </>
              ) : (
                "Complete Setup"
              )}
            </button>
          </form>

          {/* ── Card footer ── */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-center text-xs text-gray-500 border-t border-gray-100">
            <span className="mr-1">Already registered?</span>
            <span
              onClick={() => navigate("/admin-login")}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
