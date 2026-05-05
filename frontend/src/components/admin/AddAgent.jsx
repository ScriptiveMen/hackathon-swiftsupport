import React, { useState, useRef, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Loader from "../common/Loader.jsx";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  UserPlus,
  CheckCircle,
  Clock,
  Briefcase,
  Download,
  Star,
  Shield,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { useSearch } from "../../context/SearchContext.jsx";
import toast from "react-hot-toast";
import { useSocket } from "../../context/SocketContext.jsx";



const DEPARTMENTS = ["All", "Tech Support", "Billing", "Sales", "General"];

const ROLES = ["Staff", "Manager"];
const STATUSES = ["All", "Active", "Inactive", "On Leave"];
const PAGE_SIZE = 5;

const DEPT_COLORS = {
  "Tech Support": { bg: "#eff6ff", color: "#2563eb" },
  Billing: { bg: "#fdf4ff", color: "#9333ea" },
  Sales: { bg: "#f0fdf4", color: "#16a34a" },
  General: { bg: "#f3f4f6", color: "#4b5563" },
};

const avatarColors = [
  "#0072c6",
  "#16a34a",
  "#d97706",
  "#9333ea",
  "#e11d48",
  "#059669",
  "#ea580c",
  "#2563eb",
];
const getColor = (name) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];
const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Stars = ({ n }) => (
  <span style={{ display: "flex", gap: "1px" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={11}
        fill={i <= n ? "#f59e0b" : "none"}
        color={i <= n ? "#f59e0b" : "#d1d5db"}
      />
    ))}
  </span>
);

/* ── Right Side Panel ── */
const RightPanel = ({ open, onClose, entry, onSave }) => {
  const blank = {
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "Tech Support",
    role: "Staff",
    status: "Active",
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(
      entry
        ? {
            name: entry.name,
            email: entry.email,
            phone: entry.phone || "",
            password: entry.password || "",
            department: entry.department,
            role: entry.role,
            status: entry.status,
          }
        : blank,
    );
    setErrors({});
  }, [entry, open]);

  const h = (k) => (e) => {
    let val = e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((errs) => ({ ...errs, [k]: "" }));
  };

  const inp = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e2eef8",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#1a3a4a",
    background: "#f8fbff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter',sans-serif",
    transition: "border-color 0.2s",
  };
  const lbl = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#5a7a8a",
    marginBottom: "6px",
    display: "block",
  };
  const focus = (e) => (e.target.style.borderColor = "#0072c6");
  const blur = (e) => (e.target.style.borderColor = "#e2eef8");

  const handleSave = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Agent Name is required.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "A valid Email is required.";
    if (!form.phone.trim() || form.phone.length !== 10)
      newErrors.phone = "Phone Number must be exactly 10 digits.";
    if (!form.password.trim() || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.18)",
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "400px",
          background: "#fff",
          boxShadow: "-4px 0 32px rgba(0,114,198,0.12)",
          zIndex: 300,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2eef8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: "#1a3a4a",
              }}
            >
              {entry ? "Edit Agent Profile" : "Add Support Agent"}
            </p>
            <p
              style={{ margin: "2px 0 0", fontSize: "12px", color: "#5a7a8a" }}
            >
              {entry
                ? "Update employee details"
                : "Register a new support staff member"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f0f7ff",
              borderRadius: "8px",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
            }}
          >
            <X size={16} color="#5a7a8a" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={h("name")}
              placeholder="e.g. John Doe"
              style={{
                ...inp,
                borderColor: errors.name ? "#ef4444" : "#e2eef8",
              }}
              onFocus={focus}
              onBlur={(e) => {
                blur(e);
                if (errors.name) e.target.style.borderColor = "#ef4444";
              }}
            />
            {errors.name && (
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#ef4444",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {errors.name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={h("email")}
              placeholder="e.g. john@swiftsupport.com"
              style={{
                ...inp,
                borderColor: errors.email ? "#ef4444" : "#e2eef8",
              }}
              onFocus={focus}
              onBlur={(e) => {
                blur(e);
                if (errors.email) e.target.style.borderColor = "#ef4444";
              }}
            />
            {errors.email && (
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#ef4444",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {errors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Phone Number *</label>
            <input
              type="text"
              maxLength={10}
              value={form.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                setForm((f) => ({ ...f, phone: val }));
                if (errors.phone && val.length === 10)
                  setErrors((errs) => ({ ...errs, phone: "" }));
              }}
              placeholder="e.g. 9876543210"
              style={{
                ...inp,
                borderColor: errors.phone ? "#ef4444" : "#e2eef8",
              }}
              onFocus={focus}
              onBlur={(e) => {
                blur(e);
                if (errors.phone) e.target.style.borderColor = "#ef4444";
              }}
            />
            {errors.phone && (
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#ef4444",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {errors.phone}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={h("password")}
              placeholder="Create a strong password"
              style={{
                ...inp,
                borderColor: errors.password ? "#ef4444" : "#e2eef8",
              }}
              onFocus={focus}
              onBlur={(e) => {
                blur(e);
                if (errors.password) e.target.style.borderColor = "#ef4444";
              }}
            />
            {errors.password && (
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#ef4444",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {errors.password}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Department</label>
            <select
              value={form.department}
              onChange={h("department")}
              style={{ ...inp, cursor: "pointer" }}
            >
              {DEPARTMENTS.filter((d) => d !== "All").map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Role Level</label>
            <select
              value={form.role}
              onChange={h("role")}
              style={{ ...inp, cursor: "pointer" }}
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Status</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["Active", "Inactive", "On Leave"].map((s) => (
                <button
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "10px",
                    border: "1.5px solid",
                    borderColor: form.status === s ? "#0072c6" : "#e2eef8",
                    background: form.status === s ? "#f0f7ff" : "#fff",
                    color: form.status === s ? "#0072c6" : "#5a7a8a",
                    fontWeight: form.status === s ? 600 : 400,
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    minWidth: "80px",
                  }}
                >
                  {s === "Active" ? (
                    <CheckCircle
                      size={13}
                      color={form.status === s ? "#0072c6" : "#9ca3af"}
                    />
                  ) : (
                    <Clock
                      size={13}
                      color={form.status === s ? "#0072c6" : "#9ca3af"}
                    />
                  )}{" "}
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#f0f7ff",
              borderRadius: "12px",
              padding: "14px 16px",
              border: "1px solid #d0eaf9",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#0072c6",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ShieldCheck size={13} /> Permissions Tip
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11.5px",
                color: "#5a7a8a",
                lineHeight: 1.7,
              }}
            >
              Agents with the <b>Manager</b> role have access to export customer
              data and override billing issues.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e2eef8",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1.5px solid #e2eef8",
              background: "#fff",
              color: "#5a7a8a",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg,#04b8ff,#0072c6)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,114,198,0.3)",
            }}
          >
            {entry ? "Save Changes" : "Add Agent"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Action Menu ── */
const ActionMenu = ({ id, openId, setOpenId, onEdit, onDelete }) => {
  const ref = useRef(null);
  const isOpen = openId === id;
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenId(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [setOpenId]);
  const btnBase = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 14px",
    border: "none",
    background: "transparent",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'Inter',sans-serif",
  };
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "6px",
          display: "flex",
          color: "#5a7a8a",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "30px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.13)",
            border: "1px solid #e2eef8",
            width: "130px",
            zIndex: 100,
            overflow: "hidden",
            animation: "fadeDown 0.15s ease",
          }}
        >
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              onEdit();
              setOpenId(null);
            }}
            style={{ ...btnBase, color: "#1a3a4a" }}
          >
            <Edit2 size={13} /> Edit Profile
          </button>
          <div
            style={{ height: "1px", background: "#f0f7ff", margin: "4px 0" }}
          />
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              onDelete();
              setOpenId(null);
            }}
            style={{ ...btnBase, color: "#ef4444" }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
const AddAgent = () => {
  const { searchTerm } = useSearch();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Data Fetching
  const { socket } = useSocket();

  const getAgents = async () => {
    try {
      const { data } = await axiosClient.get("/auth/agents");
      setAgents(data.agents || data.data || data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAgents().finally(() => setLoading(false));
  }, []);

  const toggleAccountStatus = async (agent) => {
    const newStatus = !agent.isActive;
    // Update local state immediately
    setAgents(prev => prev.map(a => 
      String(a._id) === String(agent._id) ? { ...a, isActive: newStatus } : a
    ));

    try {
      await axiosClient.put(`/auth/toggleAccountStatus/${agent._id}`, { isActive: newStatus });
    } catch (err) {
      console.error("Failed to toggle agent account status:", err);
      // Rollback
      setAgents(prev => prev.map(a => 
        String(a._id) === String(agent._id) ? { ...a, isActive: !newStatus } : a
      ));
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("agent_created", () => getAgents());
    socket.on("agent_updated", (data) => {
      setAgents(prev => prev.map(a => 
        String(a._id) === String(data.agentId || data.userId) 
          ? { ...a, isActive: data.isActive !== undefined ? data.isActive : a.isActive } 
          : a
      ));
    });
    socket.on("status_update", (data) => {
       setAgents(prev => prev.map(a => 
         String(a._id) === String(data.userId)
           ? { ...a, isOnline: data.isOnline, status: data.status || a.status, lastSeen: data.lastSeen }
           : a
       ));
    });

    return () => {
      socket.off("agent_created");
      socket.off("agent_updated");
      socket.off("status_update");
    };
  }, [socket]);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (type === "success") toast.success(message);
    else toast.error(message);
  };

  useEffect(() => {
    if (searchTerm !== undefined) {
      setSearch(searchTerm);
      setPage(1);
    }
  }, [searchTerm]);

  useEffect(() => {
    const h = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const data = agents || [];

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    const name = (r.name || r.userName || "").toLowerCase();
    const email = (r.email || "").toLowerCase();
    const mQ = name.includes(q) || email.includes(q);
    const mD = deptFilter === "All" || r.department === deptFilter;
    const mS = statusFilter === "All" || r.status === statusFilter;
    return mQ && mD && mS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = async (form) => {
    if (editEntry) {
      // Edit logic using axiosClient
      try {
        const agentId = editEntry._id || editEntry.id;
        await axiosClient.put(`/auth/updateAgent/${agentId}`, form);
        showToast("Profile update saved successfully.", "success");
        // Re-fetch agents
        const { data: fetchRes } = await axiosClient.get("/auth/agents");
        setAgents(fetchRes.agents || fetchRes.data || fetchRes);
      } catch (err) {
        showToast(
          err.response?.data?.message || "Failed to update agent.",
          "error",
        );
      }
    } else {
      // Register new agent via API
      try {
        await axiosClient.post("/auth/createAgent", form);
        showToast("Agent added successfully!");
        // Re-fetch agents
        const { data: fetchRes } = await axiosClient.get("/auth/agents");
        setAgents(fetchRes.agents || fetchRes.data || fetchRes);
      } catch (err) {
        showToast(
          err.response?.data?.message || "Failed to add agent.",
          "error",
        );
        return;
      }
    }
    setPage(1);
  };

  const handleDelete = async (id) => {
    showToast("Delete not supported via UI yet.", "error");
  };

  const openAdd = () => {
    setEditEntry(null);
    setPanelOpen(true);
  };
  const openEdit = (row) => {
    setTimeout(() => {
      setEditEntry({ ...row });
      setPanelOpen(true);
    }, 10);
  };

  const handleExportCSV = () => {
    if (!filtered || !filtered.length) return;
    const headers = [
      "Name",
      "Email",
      "Department",
      "Role",
      "Status",
      "Joined",
      "Tickets Handled",
      "Rating",
    ];
    const rows = filtered.map((r) => [
      r.name,
      r.email,
      r.department,
      r.role,
      r.status,
      r.created,
      r.tickets,
      r.rating,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) =>
          e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "support_agents_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCount = data.filter((r) => r.status === "Active").length;
  const leaveCount = data.filter((r) => r.status === "On Leave").length;
  const managerCount = data.filter((r) => r.role === "Manager").length;

  return (
    <>
      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) translateX(-50%); } to { opacity:1; transform:translateY(0) translateX(-50%); } }
        .agent-row:hover { background:#f8fbff !important; }
        .agent-search:focus { border-color:#0072c6 !important; outline:none; }
      `}</style>

      <div
        style={{
          padding: "24px",
          minHeight: "100%",
          background: "#f0f7ff",
          fontFamily: "'Inter',sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                color: "#1a3a4a",
              }}
            >
              Support Agents
            </h2>
            <p
              style={{ margin: "4px 0 0", fontSize: "13px", color: "#5a7a8a" }}
            >
              Manage your support team and their performance.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ab0be",
                }}
              />
              <input
                className="agent-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search agents..."
                style={{
                  paddingLeft: "32px",
                  paddingRight: "12px",
                  height: "36px",
                  border: "1.5px solid #e2eef8",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#1a3a4a",
                  background: "#fff",
                  width: "210px",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
            {/* Filter */}
            <div ref={filterRef} style={{ position: "relative" }}>
              <button
                onClick={() => setFilterOpen((o) => !o)}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  border: "1.5px solid #e2eef8",
                  borderRadius: "10px",
                  background: "#fff",
                  color: "#5a7a8a",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Filter size={14} /> Filter
              </button>
              {filterOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "42px",
                    background: "#fff",
                    borderRadius: "14px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    border: "1px solid #e2eef8",
                    padding: "16px",
                    zIndex: 100,
                    minWidth: "220px",
                    animation: "fadeDown 0.15s ease",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9ab0be",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Department
                  </p>
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDeptFilter(d);
                        setPage(1);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          deptFilter === d ? "#f0f7ff" : "transparent",
                        color: deptFilter === d ? "#0072c6" : "#1a3a4a",
                        fontSize: "13px",
                        fontWeight: deptFilter === d ? 600 : 400,
                        cursor: "pointer",
                        marginBottom: "2px",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                  <p
                    style={{
                      margin: "12px 0 8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9ab0be",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Status
                  </p>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setPage(1);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          statusFilter === s ? "#f0f7ff" : "transparent",
                        color: statusFilter === s ? "#0072c6" : "#1a3a4a",
                        fontSize: "13px",
                        fontWeight: statusFilter === s ? 600 : 400,
                        cursor: "pointer",
                        marginBottom: "2px",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Export */}
            <button
              onClick={handleExportCSV}
              style={{
                height: "36px",
                padding: "0 16px",
                border: "1.5px solid #e2eef8",
                borderRadius: "10px",
                background: "#fff",
                color: "#5a7a8a",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f7ff")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <Download size={15} /> Export CSV
            </button>
            {/* Add Agent */}
            <button
              onClick={openAdd}
              style={{
                height: "36px",
                padding: "0 16px",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(90deg,#04b8ff,#0072c6)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(0,114,198,0.3)",
              }}
            >
              <Plus size={15} /> Add Agent
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {[
            {
              label: "Total Agents",
              value: data.length,
              color: "#0072c6",
              bg: "#f0f7ff",
              Icon: UserPlus,
            },
            {
              label: "Active Now",
              value: activeCount,
              color: "#16a34a",
              bg: "#f0fdf4",
              Icon: CheckCircle,
            },
            {
              label: "On Leave",
              value: leaveCount,
              color: "#ea580c",
              bg: "#fff7ed",
              Icon: Clock,
            },
            {
              label: "Managers",
              value: managerCount,
              color: "#9333ea",
              bg: "#fdf4ff",
              Icon: Shield,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "16px 18px",
                boxShadow: "0 2px 12px rgba(0,114,198,0.08)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: s.bg,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <s.Icon size={18} color={s.color} />
              </div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "11px",
                  color: "#5a7a8a",
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#1a3a4a",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 2px 16px rgba(0,114,198,0.08)",
            overflowX: "auto",
          }}
        >
          <div style={{ minWidth: "900px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "14px 20px 0",
              }}
            >
              <span style={{ fontSize: "12px", color: "#9ab0be" }}>
                {filtered.length.toLocaleString()} agents
              </span>
            </div>

            {/* Head */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1.5fr 1fr 100px 120px 80px",
                padding: "10px 20px",
                borderBottom: "1px solid #f0f7ff",
              }}
            >
              {["AGENT", "CONTACT", "ROLE", "ACCOUNT", "PRESENCE", ""].map(
                (h, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9ab0be",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </span>
                ),
              )}
            </div>

            {loading ? (
              <div
                style={{
                  padding: "48px",
                  textAlign: "center",
                  color: "#9ab0be",
                  fontSize: "14px",
                }}
              >
                Loading agents...
              </div>
            ) : paginated.length === 0 ? (
              <div
                style={{
                  padding: "48px",
                  textAlign: "center",
                  color: "#9ab0be",
                  fontSize: "14px",
                }}
              >
                No agents found.
              </div>
            ) : (
              paginated.map((agent, i) => {
                return (
                  <div
                    key={agent._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2.2fr 1.5fr 1fr 100px 120px 80px",
                      padding: "13px 20px",
                      borderBottom:
                        i < paginated.length - 1 ? "1px solid #f5f9ff" : "none",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Agent */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: getColor(agent.name),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {initials(agent.name)}
                        </span>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: "0 0 2px",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#1a3a4a",
                          }}
                        >
                          {agent.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "#9ab0be",
                          }}
                        >
                          {agent.role}
                        </p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div style={{ fontSize: "12px", color: "#5a7a8a" }}>
                      {agent.email}
                    </div>

                    {/* Role */}
                    <div style={{ display: "flex" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#0072c6",
                          background: "#f0f7ff",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          textTransform: "capitalize",
                        }}
                      >
                        {agent.role}
                      </span>
                    </div>

                    {/* Account Status */}
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: agent.isActive ? "#16a34a" : "#ef4444",
                        background: agent.isActive ? "#f0fdf4" : "#fef2f2",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        width: "fit-content"
                      }}
                    >
                      {agent.isActive ? "Active" : "Disabled"}
                    </span>

                    {/* Presence */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background:
                            agent.status === "Available"
                              ? "#16a34a"
                              : agent.status === "Busy"
                                ? "#ea580c"
                                : "#94a3b8",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "#1a3a4a",
                        }}
                      >
                        {agent.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
                      <button
                        onClick={() => toggleAccountStatus(agent)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                          border: "1px solid",
                          borderColor: agent.isActive ? "#ef4444" : "#16a34a",
                          color: agent.isActive ? "#ef4444" : "#16a34a",
                          background: "transparent",
                          cursor: "pointer",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {agent.isActive ? "Disable" : "Enable"}
                      </button>
                      <ActionMenu
                        id={agent._id}
                        openId={openId}
                        setOpenId={setOpenId}
                        onEdit={() => openEdit(agent)}
                        onDelete={() => handleDelete(agent._id)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderTop: "1px solid #f0f7ff",
            }}
          >
            <span style={{ fontSize: "12px", color: "#9ab0be" }}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}{" "}
              to {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2eef8",
                  background: "#fff",
                  color: page === 1 ? "#c0d4e4" : "#1a3a4a",
                  fontSize: "12px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2eef8",
                  background: "#fff",
                  color: page === totalPages ? "#c0d4e4" : "#1a3a4a",
                  fontSize: "12px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <RightPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        entry={editEntry}
        onSave={handleSave}
      />
    </>
  );
};

export default AddAgent;
