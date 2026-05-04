import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Tag,
  BookOpen,
  Download,
} from "lucide-react";

/* ── Seed Data ───────────────────────────────────────────────────── */
const SEED = [
  { id: 1, question: "How do I reset my account password if I lost access to my email?", variant: "I forgot my password and email, help.", category: "Login & Security", status: "Synced", owner: "admin" },
  { id: 2, question: "What is the refund policy for annual enterprise subscriptions?", variant: "Can I get a refund on yearly plan?", category: "Billing", status: "Synced", owner: "admin" },
  { id: 3, question: "How do I add a new agent to my team workspace?", variant: "Steps to invite a team member.", category: "User Management", status: "Pending", owner: "admin" },
  { id: 4, question: "Are there any rate limits on the REST API for basic tiers?", variant: "API limit for standard plan.", category: "API & Dev", status: "Synced", owner: "admin" },
  { id: 5, question: "Can I integrate SwiftSupport with Slack?", variant: "Slack integration setup guide.", category: "Integrations", status: "Synced", owner: "admin" },
  { id: 6, question: "How do I export my chat history and ticket logs?", variant: "Download all support tickets.", category: "Export", status: "Pending", owner: "admin" },
  { id: 7, question: "What languages does the AI chatbot support?", variant: "Multilingual bot support.", category: "AI & Bot", status: "Synced", owner: "admin" },
  { id: 8, question: "How can I customize the chatbot widget appearance?", variant: "Change bot colors and logo.", category: "Customization", status: "Synced", owner: "admin" },
  { id: 9, question: "Is two-factor authentication available?", variant: "Enable 2FA on my account.", category: "Login & Security", status: "Synced", owner: "admin" },
  { id: 10, question: "How do I upgrade my subscription plan?", variant: "Switch from starter to pro.", category: "Billing", status: "Pending", owner: "admin" },
  { id: 11, question: "Can I white-label the support portal?", variant: "Remove SwiftSupport branding.", category: "Customization", status: "Synced", owner: "admin" },
  { id: 12, question: "What analytics are available in the dashboard?", variant: "View ticket and message metrics.", category: "Analytics", status: "Synced", owner: "admin" },
];

const CATEGORIES = ["All", "Login & Security", "Billing", "User Management", "API & Dev", "Integrations", "Export", "AI & Bot", "Customization", "Analytics"];
const STATUSES = ["All", "Synced", "Pending"];
const PAGE_SIZE = 5;

const CATEGORY_COLORS = {
  "Login & Security": { bg: "#eef2ff", color: "#4f46e5" },
  "Billing":          { bg: "#fef3c7", color: "#d97706" },
  "User Management":  { bg: "#f0fdf4", color: "#16a34a" },
  "API & Dev":        { bg: "#f0f9ff", color: "#0284c7" },
  "Integrations":     { bg: "#fdf4ff", color: "#9333ea" },
  "Export":           { bg: "#fff7ed", color: "#ea580c" },
  "AI & Bot":         { bg: "#ecfdf5", color: "#059669" },
  "Customization":    { bg: "#fff1f2", color: "#e11d48" },
  "Analytics":        { bg: "#f0f7ff", color: "#0072c6" },
};

/* ── Helpers ─────────────────────────────────────────────────────── */
const CategoryBadge = ({ cat }) => {
  const style = CATEGORY_COLORS[cat] || { bg: "#f0f7ff", color: "#0072c6" };
  return (
    <span style={{ background: style.bg, color: style.color, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" }}>
      {cat}
    </span>
  );
};

const StatusBadge = ({ status }) => (
  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 500, color: status === "Synced" ? "#16a34a" : "#9ca3af" }}>
    {status === "Synced"
      ? <CheckCircle size={13} color="#16a34a" />
      : <Clock size={13} color="#9ca3af" />}
    {status}
  </span>
);

/* ── Right Panel ─────────────────────────────────────────────────── */
const RightPanel = ({ open, onClose, entry, onSave }) => {
  const [form, setForm] = useState({ question: "", variant: "", answer: "", category: "Billing", status: "Synced" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entry) setForm({ question: entry.question, variant: entry.variant, answer: entry.answer || "", category: entry.category, status: entry.status });
    else setForm({ question: "", variant: "", answer: "", category: "Billing", status: "Synced" });
    setErrors({});
  }, [entry, open]);

  const handle = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(errs => ({ ...errs, [k]: "" }));
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", border: "1.5px solid #e2eef8",
    borderRadius: "10px", fontSize: "13px", color: "#1a3a4a",
    background: "#f8fbff", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "'Inter', sans-serif",
  };
  const labelStyle = { fontSize: "12px", fontWeight: 600, color: "#5a7a8a", marginBottom: "6px", display: "block" };

  const handleSave = () => {
    const newErrors = {};
    if (!form.question.trim()) newErrors.question = "Question is required.";
    if (!form.answer.trim()) newErrors.answer = "Answer is required.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(form);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)",
          zIndex: 200, opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />
      {/* Slide Panel */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, height: "100vh", width: "400px",
          background: "#fff", boxShadow: "-4px 0 32px rgba(0,114,198,0.12)",
          zIndex: 300, display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2eef8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1a3a4a" }}>
              {entry ? "Edit FAQ Entry" : "New FAQ Entry"}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#5a7a8a" }}>
              {entry ? "Update the question and metadata" : "Add a new question-answer pair"}
            </p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f0f7ff", borderRadius: "8px", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center" }}>
            <X size={16} color="#5a7a8a" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Question */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Question *</label>
            <textarea
              rows={3}
              value={form.question}
              onChange={handle("question")}
              placeholder="Enter the FAQ question..."
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, borderColor: errors.question ? "#ef4444" : "#e2eef8" }}
              onFocus={e => e.target.style.borderColor = "#0072c6"}
              onBlur={e => { e.target.style.borderColor = errors.question ? "#ef4444" : "#e2eef8"; }}
            />
            {errors.question && <span style={{ display:"block", fontSize:"11px", color:"#ef4444", marginTop:"4px", fontWeight:500 }}>{errors.question}</span>}
          </div>

          {/* Variant */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Variant / Paraphrase</label>
            <textarea
              rows={2}
              value={form.variant}
              onChange={handle("variant")}
              placeholder="Alternative phrasing of the question..."
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#0072c6"}
              onBlur={e => e.target.style.borderColor = "#e2eef8"}
            />
            <p style={{ fontSize: "11px", color: "#9ab0be", marginTop: "5px" }}>Helps the AI match more user queries.</p>
          </div>

          {/* Answer */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Answer *</label>
            <textarea
              rows={5}
              value={form.answer}
              onChange={handle("answer")}
              placeholder="Write the full answer here..."
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, borderColor: errors.answer ? "#ef4444" : "#e2eef8" }}
              onFocus={e => e.target.style.borderColor = "#0072c6"}
              onBlur={e => { e.target.style.borderColor = errors.answer ? "#ef4444" : "#e2eef8"; }}
            />
            {errors.answer && <span style={{ display:"block", fontSize:"11px", color:"#ef4444", marginTop:"4px", fontWeight:500 }}>{errors.answer}</span>}
          </div>

          {/* Category */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={handle("category")}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Synced", "Pending"].map(s => (
                <button
                  key={s}
                  onClick={() => setForm(f => ({ ...f, status: s }))}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "10px", border: "1.5px solid",
                    borderColor: form.status === s ? "#0072c6" : "#e2eef8",
                    background: form.status === s ? "#f0f7ff" : "#fff",
                    color: form.status === s ? "#0072c6" : "#5a7a8a",
                    fontWeight: form.status === s ? 600 : 400,
                    fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <StatusBadge status={s} />
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: "#f0f7ff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #d0eaf9" }}>
            <p style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: 600, color: "#0072c6", display: "flex", alignItems: "center", gap: "6px" }}>
              <BookOpen size={13} /> AI Training Tips
            </p>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11.5px", color: "#5a7a8a", lineHeight: 1.7 }}>
              <li>Keep questions concise and specific.</li>
              <li>Add variants to improve matching accuracy.</li>
              <li>Set status to <b>Synced</b> once answer is verified.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2eef8", display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e2eef8", background: "#fff", color: "#5a7a8a", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ flex: 2, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(90deg,#04b8ff,#0072c6)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,114,198,0.3)" }}
          >
            {entry ? "Save Changes" : "Add Entry"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Dropdown Menu ───────────────────────────────────────────────── */
const ActionMenu = ({ id, openId, setOpenId, onEdit, onDuplicate, onDelete, openUp }) => {
  const ref = useRef(null);
  const isOpen = openId === id;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenId(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setOpenId]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px", borderRadius: "6px", display: "flex", alignItems: "center", color: "#5a7a8a" }}
        onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", right: 0, top: openUp ? "auto" : "30px", bottom: openUp ? "30px" : "auto", background: "#fff", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.13)", border: "1px solid #e2eef8", width: "140px", zIndex: 100, overflow: "hidden", animation: "fadeDown 0.15s ease" }}>
          <button onClick={() => { onEdit(); setOpenId(null); }} style={menuBtnStyle("#1a3a4a")}>
            <Edit2 size={13} /> Edit
          </button>
          <button onClick={() => { onDuplicate(); setOpenId(null); }} style={menuBtnStyle("#1a3a4a")}>
            <Copy size={13} /> Duplicate
          </button>
          <div style={{ height: "1px", background: "#f0f7ff", margin: "4px 0" }} />
          <button onClick={() => { onDelete(); setOpenId(null); }} style={menuBtnStyle("#ef4444")}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

const menuBtnStyle = (color) => ({
  width: "100%", display: "flex", alignItems: "center", gap: "8px",
  padding: "9px 14px", border: "none", background: "transparent",
  color, fontSize: "13px", cursor: "pointer", textAlign: "left",
  transition: "background 0.15s",
  fontFamily: "'Inter', sans-serif",
});

/* ── Main Knowledge Base Component ───────────────────────────────── */
const AgentKnowledgeBase = () => {
  const [data, setData] = useState(() => {
    try {
      const local = localStorage.getItem("ss_faqs");
      return local ? JSON.parse(local) : SEED;
    } catch (e) {
      return SEED;
    }
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = currentUser.email || "agent";
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Filter */
  const filtered = data.filter(r => {
    if (r.owner && r.owner !== "admin" && r.owner !== userEmail) return false;
    
    const q = search.toLowerCase();
    const matchQ = r.question.toLowerCase().includes(q) || r.variant.toLowerCase().includes(q);
    const matchC = catFilter === "All" || r.category === catFilter;
    const matchS = statusFilter === "All" || r.status === statusFilter;
    return matchQ && matchC && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Actions */
  const handleSave = (form) => {
    let newData;
    if (editEntry) {
      newData = data.map(r => r.id === editEntry.id ? { ...r, ...form } : r);
    } else {
      newData = [...data, { ...form, id: Date.now(), owner: userEmail }];
    }
    setData(newData);
    localStorage.setItem("ss_faqs", JSON.stringify(newData));
    setPage(1);
  };
  const handleDuplicate = (row) => {
    const newData = [...data, { ...row, id: Date.now(), question: row.question + " (copy)", owner: userEmail }];
    setData(newData);
    localStorage.setItem("ss_faqs", JSON.stringify(newData));
  };
  const handleDelete = (id) => {
    const newData = data.filter(r => r.id !== id);
    setData(newData);
    localStorage.setItem("ss_faqs", JSON.stringify(newData));
  };

  const openAdd = () => { setEditEntry(null); setPanelOpen(true); };
  const openEdit = (row) => { setEditEntry(row); setPanelOpen(true); };

  const handleExportCSV = () => {
    if (!filtered || !filtered.length) return;
    const headers = ["Question", "Variant", "Answer", "Category", "Status"];
    const rows = filtered.map(r => [r.question, r.variant, r.answer, r.category, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "faq_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .faq-row:hover { background: #f8fbff !important; }
        .faq-search:focus { border-color: #0072c6 !important; outline: none; }
      `}</style>

      <div style={{ padding: "24px", minHeight: "100%", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "22px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1a3a4a" }}>AI Training Dataset</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5a7a8a" }}>Manage structured FAQ pairs to improve bot response accuracy.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginLeft: "auto" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#9ab0be" }} />
              <input
                className="faq-search"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search training data..."
                style={{ paddingLeft: "32px", paddingRight: "12px", height: "36px", border: "1.5px solid #e2eef8", borderRadius: "10px", fontSize: "13px", color: "#1a3a4a", background: "#fff", width: "220px", transition: "border-color 0.2s" }}
              />
            </div>

            {/* Filter dropdown */}
            <div ref={filterRef} style={{ position: "relative" }}>
              <button
                onClick={() => setFilterOpen(o => !o)}
                style={{ height: "36px", padding: "0 14px", border: "1.5px solid #e2eef8", borderRadius: "10px", background: "#fff", color: "#5a7a8a", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Filter size={14} /> Filter
              </button>
              {filterOpen && (
                <div style={{ position: "absolute", right: 0, top: "42px", background: "#fff", borderRadius: "14px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e2eef8", padding: "16px", zIndex: 100, minWidth: "220px", animation: "fadeDown 0.15s ease" }}>
                  <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, color: "#9ab0be", textTransform: "uppercase", letterSpacing: "0.5px" }}>Category</p>
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => { setCatFilter(c); setPage(1); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: "8px", border: "none", background: catFilter === c ? "#f0f7ff" : "transparent", color: catFilter === c ? "#0072c6" : "#1a3a4a", fontSize: "13px", fontWeight: catFilter === c ? 600 : 400, cursor: "pointer", marginBottom: "2px" }}>
                      {c}
                    </button>
                  ))}
                  <p style={{ margin: "12px 0 8px", fontSize: "11px", fontWeight: 700, color: "#9ab0be", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</p>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: "8px", border: "none", background: statusFilter === s ? "#f0f7ff" : "transparent", color: statusFilter === s ? "#0072c6" : "#1a3a4a", fontSize: "13px", fontWeight: statusFilter === s ? 600 : 400, cursor: "pointer", marginBottom: "2px" }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <button onClick={handleExportCSV} style={{ height:"36px", padding:"0 16px", border:"1.5px solid #e2eef8", borderRadius:"10px", background:"#fff", color:"#5a7a8a", fontSize:"13px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#f0f7ff"} onMouseLeave={e => e.currentTarget.style.background="#fff"}>
              <Download size={15} /> Export CSV
            </button>
            {/* New Entry */}
            <button
              onClick={openAdd}
              style={{ height: "36px", padding: "0 16px", border: "none", borderRadius: "10px", background: "linear-gradient(90deg,#04b8ff,#0072c6)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(0,114,198,0.3)" }}
            >
              <Plus size={15} /> New Training Entry
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,114,198,0.08)", overflowX: "auto" }}>
          <div style={{ minWidth: "900px" }}>
          {/* Total count */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 20px 0" }}>
            <span style={{ fontSize: "12px", color: "#9ab0be" }}>{filtered.length.toLocaleString()} total entries</span>
          </div>

          {/* Table Head */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 130px 40px", padding: "10px 20px", borderBottom: "1px solid #f0f7ff" }}>
            {["QUESTION", "CATEGORY", "STATUS", ""].map((h, i) => (
              <span key={i} style={{ fontSize: "11px", fontWeight: 700, color: "#9ab0be", letterSpacing: "0.5px" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#9ab0be", fontSize: "14px" }}>
              No entries found. Try adjusting your filters.
            </div>
          ) : paginated.map((row, i) => (
            <div
              key={row.id}
              className="faq-row"
              style={{ display: "grid", gridTemplateColumns: "1fr 160px 130px 40px", padding: "14px 20px", borderBottom: i < paginated.length - 1 ? "1px solid #f5f9ff" : "none", alignItems: "center", transition: "background 0.15s" }}
            >
              {/* Question */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 600, color: "#1a3a4a", lineHeight: 1.4 }}>{row.question}</p>
                  {row.owner === userEmail && (
                    <span style={{ fontSize: "10px", background: "#f0fdf4", color: "#16a34a", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, border: "1px solid #bbf7d0", whiteSpace: "nowrap" }}>My FAQ</span>
                  )}
                  {row.owner === "admin" && (
                    <span style={{ fontSize: "10px", background: "#f0f7ff", color: "#0072c6", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, border: "1px solid #dceefa", whiteSpace: "nowrap" }}>Global</span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#9ab0be", fontStyle: "italic" }}>Variant: {row.variant}</p>
              </div>
              {/* Category */}
              <div><CategoryBadge cat={row.category} /></div>
              {/* Status */}
              <div><StatusBadge status={row.status} /></div>
              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {row.owner === "admin" ? (
                  <span style={{ fontSize: "11px", color: "#9ab0be", fontStyle: "italic", paddingRight: "10px" }}>Read-only</span>
                ) : (
                  <ActionMenu
                    id={row.id}
                    openId={openId}
                    setOpenId={setOpenId}
                    onEdit={() => openEdit(row)}
                    onDuplicate={() => handleDuplicate(row)}
                    onDelete={() => handleDelete(row.id)}
                    openUp={i >= paginated.length - 2}
                  />
                )}
              </div>
            </div>
          ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #f0f7ff" }}>
            <span style={{ fontSize: "12px", color: "#9ab0be" }}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "6px 14px", borderRadius: "8px", border: "1.5px solid #e2eef8", background: "#fff", color: page === 1 ? "#c0d4e4" : "#1a3a4a", fontSize: "12px", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: "6px 14px", borderRadius: "8px", border: "1.5px solid #e2eef8", background: "#fff", color: page === totalPages ? "#c0d4e4" : "#1a3a4a", fontSize: "12px", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <RightPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        entry={editEntry}
        onSave={handleSave}
      />
    </>
  );
};

export default AgentKnowledgeBase;
