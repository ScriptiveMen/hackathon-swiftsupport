import React, { useState, useRef, useEffect } from "react";
import {
  Search, Filter, Plus, MoreVertical, Edit2, Trash2,
  ChevronLeft, ChevronRight, X, Mail, Phone, Globe,
  CheckCircle, Clock, UserCircle, Star, Download
} from "lucide-react";

const SEED = [
  { id: 1, name: "Sarah Jenkins",   email: "sarah@acme.com",      phone: "+1 555-0101", company: "Acme Corp",       plan: "Enterprise", status: "Active",   joined: "Jan 12, 2024", tickets: 4, rating: 5 },
  { id: 2, name: "Mark Thompson",   email: "mark@bluewave.io",    phone: "+1 555-0182", company: "BlueWave IO",     plan: "Pro",        status: "Active",   joined: "Feb 3, 2024",  tickets: 2, rating: 4 },
  { id: 3, name: "Priya Sharma",    email: "priya@technode.in",   phone: "+91 98765432",company: "TechNode",        plan: "Starter",    status: "Inactive", joined: "Mar 18, 2024", tickets: 0, rating: 3 },
  { id: 4, name: "Carlos Mendes",   email: "carlos@softpeak.co",  phone: "+55 11 9988", company: "SoftPeak",        plan: "Pro",        status: "Active",   joined: "Apr 5, 2024",  tickets: 7, rating: 5 },
  { id: 5, name: "Liu Wei",         email: "liu@cloudzen.cn",     phone: "+86 138 0013",company: "CloudZen",        plan: "Enterprise", status: "Active",   joined: "Apr 22, 2024", tickets: 3, rating: 4 },
  { id: 6, name: "Emily Carter",    email: "emily@nexasoft.com",  phone: "+1 555-0234", company: "NexaSoft",        plan: "Starter",    status: "Inactive", joined: "May 1, 2024",  tickets: 1, rating: 3 },
  { id: 7, name: "Ahmed Al-Farsi",  email: "ahmed@aqartech.ae",   phone: "+971 50 123", company: "AqarTech",        plan: "Pro",        status: "Active",   joined: "May 9, 2024",  tickets: 5, rating: 5 },
  { id: 8, name: "Nina Volkov",     email: "nina@dataspark.ru",   phone: "+7 495 000",  company: "DataSpark",       plan: "Enterprise", status: "Active",   joined: "May 20, 2024", tickets: 2, rating: 4 },
  { id: 9, name: "James O'Brien",   email: "james@greenlane.ie",  phone: "+353 87 123", company: "GreenLane",       plan: "Starter",    status: "Inactive", joined: "Jun 2, 2024",  tickets: 0, rating: 2 },
  { id: 10, name: "Sofia Bellini",  email: "sofia@luminary.it",   phone: "+39 02 1234", company: "Luminary SRL",    plan: "Pro",        status: "Active",   joined: "Jun 14, 2024", tickets: 6, rating: 5 },
];

const PLANS   = ["All", "Starter", "Pro", "Enterprise"];
const STATUSES = ["All", "Active", "Inactive"];
const PAGE_SIZE = 5;

const PLAN_COLORS = {
  Starter:    { bg: "#f0fdf4", color: "#16a34a" },
  Pro:        { bg: "#eff6ff", color: "#2563eb" },
  Enterprise: { bg: "#fdf4ff", color: "#9333ea" },
};

const avatarColors = ["#0072c6","#16a34a","#d97706","#9333ea","#e11d48","#059669","#ea580c","#2563eb"];
const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];
const initials  = (name) => name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

const Stars = ({ n }) => (
  <span style={{ display:"flex", gap:"1px" }}>
    {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i<=n?"#f59e0b":"none"} color={i<=n?"#f59e0b":"#d1d5db"} />)}
  </span>
);

/* ── Right Side Panel ── */
const RightPanel = ({ open, onClose, entry, onSave }) => {
  const blank = { name:"", email:"", phone:"", company:"", plan:"Starter", status:"Active" };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => { 
    setForm(entry ? { name:entry.name, email:entry.email, phone:entry.phone, company:entry.company, plan:entry.plan, status:entry.status } : blank); 
    setErrors({});
  }, [entry, open]);

  const h = k => e => {
    let val = e.target.value;
    if (k === "phone") {
      val = val.replace(/[^0-9]/g, "").slice(0, 10);
    }
    setForm(f => ({...f, [k]: val}));
    if (errors[k]) setErrors(errs => ({...errs, [k]: ""}));
  };

  const inp = { width:"100%", padding:"9px 12px", border:"1.5px solid #e2eef8", borderRadius:"10px", fontSize:"13px", color:"#1a3a4a", background:"#f8fbff", outline:"none", boxSizing:"border-box", fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s" };
  const lbl = { fontSize:"12px", fontWeight:600, color:"#5a7a8a", marginBottom:"6px", display:"block" };
  const focus = e => e.target.style.borderColor = "#0072c6";
  const blur  = e => e.target.style.borderColor = "#e2eef8";

  const handleSave = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "A valid Email is required.";
    if (!form.phone.trim() || form.phone.length !== 10) newErrors.phone = "Phone Number must be exactly 10 digits.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.18)", zIndex:200, opacity:open?1:0, pointerEvents:open?"auto":"none", transition:"opacity 0.25s" }} />
      <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:"400px", background:"#fff", boxShadow:"-4px 0 32px rgba(0,114,198,0.12)", zIndex:300, display:"flex", flexDirection:"column", transform:open?"translateX(0)":"translateX(100%)", transition:"transform 0.3s cubic-bezier(.4,0,.2,1)" }}>
        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #e2eef8", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ margin:0, fontSize:"15px", fontWeight:700, color:"#1a3a4a" }}>{entry ? "Edit Customer" : "Add Customer"}</p>
            <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#5a7a8a" }}>{entry ? "Update customer details" : "Register a new customer account"}</p>
          </div>
          <button onClick={onClose} style={{ border:"none", background:"#f0f7ff", borderRadius:"8px", cursor:"pointer", padding:"6px", display:"flex" }}>
            <X size={16} color="#5a7a8a" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Company","company","text"]].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom:"16px" }}>
              <label style={lbl}>{label} {["name", "email", "phone"].includes(key) && "*"}</label>
              <input type={type} maxLength={key === "phone" ? 10 : undefined} value={form[key]} onChange={h(key)} placeholder={`Enter ${label.toLowerCase()}...`} style={{...inp, borderColor: errors[key] ? "#ef4444" : "#e2eef8"}} onFocus={focus} onBlur={e => { blur(e); if(errors[key]) e.target.style.borderColor="#ef4444"; }} />
              {errors[key] && <span style={{ display:"block", fontSize:"11px", color:"#ef4444", marginTop:"4px", fontWeight:500 }}>{errors[key]}</span>}
            </div>
          ))}

          <div style={{ marginBottom:"16px" }}>
            <label style={lbl}>Plan</label>
            <select value={form.plan} onChange={h("plan")} style={{ ...inp, cursor:"pointer" }}>
              {PLANS.filter(p => p !== "All").map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label style={lbl}>Status</label>
            <div style={{ display:"flex", gap:"10px" }}>
              {["Active","Inactive"].map(s => (
                <button key={s} onClick={() => setForm(f => ({...f, status:s}))} style={{ flex:1, padding:"8px", borderRadius:"10px", border:"1.5px solid", borderColor:form.status===s?"#0072c6":"#e2eef8", background:form.status===s?"#f0f7ff":"#fff", color:form.status===s?"#0072c6":"#5a7a8a", fontWeight:form.status===s?600:400, fontSize:"12px", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                  {s === "Active" ? <CheckCircle size={13} color={form.status===s?"#0072c6":"#9ca3af"} /> : <Clock size={13} color={form.status===s?"#0072c6":"#9ca3af"} />} {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background:"#f0f7ff", borderRadius:"12px", padding:"14px 16px", border:"1px solid #d0eaf9" }}>
            <p style={{ margin:"0 0 6px", fontSize:"12px", fontWeight:600, color:"#0072c6", display:"flex", alignItems:"center", gap:"6px" }}>
              <UserCircle size={13} /> Customer Tip
            </p>
            <p style={{ margin:0, fontSize:"11.5px", color:"#5a7a8a", lineHeight:1.7 }}>
              Customers on the <b>Enterprise</b> plan get dedicated agent support and priority SLA.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:"16px 24px", borderTop:"1px solid #e2eef8", display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:"10px", border:"1.5px solid #e2eef8", background:"#fff", color:"#5a7a8a", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} style={{ flex:2, padding:"10px", borderRadius:"10px", border:"none", background:"linear-gradient(90deg,#04b8ff,#0072c6)", color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 12px rgba(0,114,198,0.3)" }}>
            {entry ? "Save Changes" : "Add Customer"}
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
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpenId(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [setOpenId]);
  const btnBase = { width:"100%", display:"flex", alignItems:"center", gap:"8px", padding:"9px 14px", border:"none", background:"transparent", fontSize:"13px", cursor:"pointer", textAlign:"left", fontFamily:"'Inter',sans-serif" };
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpenId(isOpen ? null : id)} style={{ border:"none", background:"transparent", cursor:"pointer", padding:"4px", borderRadius:"6px", display:"flex", color:"#5a7a8a" }}
        onMouseEnter={e => e.currentTarget.style.background="#f0f7ff"}
        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div style={{ position:"absolute", right:0, top:"30px", background:"#fff", borderRadius:"12px", boxShadow:"0 8px 30px rgba(0,0,0,0.13)", border:"1px solid #e2eef8", width:"130px", zIndex:100, overflow:"hidden", animation:"fadeDown 0.15s ease" }}>
          <button onClick={() => { onEdit(); setOpenId(null); }} style={{ ...btnBase, color:"#1a3a4a" }}><Edit2 size={13} /> Edit</button>
          <div style={{ height:"1px", background:"#f0f7ff", margin:"4px 0" }} />
          <button onClick={() => { onDelete(); setOpenId(null); }} style={{ ...btnBase, color:"#ef4444" }}><Trash2 size={13} /> Delete</button>
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
const Customers = () => {
  const [data, setData] = useState(() => {
    try {
      const local = localStorage.getItem("ss_customers");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.length > 0) return parsed;
      }
      // If empty, initialize with SEED
      localStorage.setItem("ss_customers", JSON.stringify(SEED));
      return SEED;
    } catch (e) {
      return SEED;
    }
  });

  const [search, setSearch]         = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]             = useState(1);
  const [openId, setOpenId]         = useState(null);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [editEntry, setEditEntry]   = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const h = e => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    const mQ = r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.company.toLowerCase().includes(q);
    const mP = planFilter === "All" || r.plan === planFilter;
    const mS = statusFilter === "All" || r.status === statusFilter;
    return mQ && mP && mS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const handleSave = form => {
    let newData;
    if (editEntry) {
      newData = data.map(r => r.id === editEntry.id ? { ...r, ...form } : r);
    } else {
      newData = [...data, { ...form, id: Date.now(), joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), tickets: 0, rating: 0 }];
    }
    setData(newData);
    localStorage.setItem("ss_customers", JSON.stringify(newData));
    setPage(1);
  };

  const handleDelete = id => {
    const newData = data.filter(r => r.id !== id);
    setData(newData);
    localStorage.setItem("ss_customers", JSON.stringify(newData));
  };

  const openAdd  = ()    => { setEditEntry(null); setPanelOpen(true); };
  const openEdit = row   => { setEditEntry(row);  setPanelOpen(true); };

  const handleExportCSV = () => {
    if (!filtered || !filtered.length) return;
    const headers = ["Name", "Email", "Phone", "Company", "Plan", "Status", "Joined", "Tickets", "Rating"];
    const rows = filtered.map(r => [r.name, r.email, r.phone, r.company, r.plan, r.status, r.joined, r.tickets, r.rating]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCount   = data.filter(r => r.status==="Active").length;
  const enterpriseCount = data.filter(r => r.plan==="Enterprise").length;

  return (
    <>
      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .cust-row:hover { background:#f8fbff !important; }
        .cust-search:focus { border-color:#0072c6 !important; outline:none; }
      `}</style>

      <div style={{ padding:"24px", minHeight:"100%", background:"#f0f7ff", fontFamily:"'Inter',sans-serif" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <h2 style={{ margin:0, fontSize:"20px", fontWeight:700, color:"#1a3a4a" }}>Customers</h2>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#5a7a8a" }}>Manage and monitor your customer base.</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
            {/* Search */}
            <div style={{ position:"relative" }}>
              <Search size={14} style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", color:"#9ab0be" }} />
              <input className="cust-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search customers..." style={{ paddingLeft:"32px", paddingRight:"12px", height:"36px", border:"1.5px solid #e2eef8", borderRadius:"10px", fontSize:"13px", color:"#1a3a4a", background:"#fff", width:"210px", transition:"border-color 0.2s" }} />
            </div>
            {/* Filter */}
            <div ref={filterRef} style={{ position:"relative" }}>
              <button onClick={() => setFilterOpen(o => !o)} style={{ height:"36px", padding:"0 14px", border:"1.5px solid #e2eef8", borderRadius:"10px", background:"#fff", color:"#5a7a8a", fontSize:"13px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
                <Filter size={14} /> Filter
              </button>
              {filterOpen && (
                <div style={{ position:"absolute", right:0, top:"42px", background:"#fff", borderRadius:"14px", boxShadow:"0 8px 30px rgba(0,0,0,0.12)", border:"1px solid #e2eef8", padding:"16px", zIndex:100, minWidth:"200px", animation:"fadeDown 0.15s ease" }}>
                  <p style={{ margin:"0 0 8px", fontSize:"11px", fontWeight:700, color:"#9ab0be", textTransform:"uppercase", letterSpacing:"0.5px" }}>Plan</p>
                  {PLANS.map(p => <button key={p} onClick={() => { setPlanFilter(p); setPage(1); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"6px 10px", borderRadius:"8px", border:"none", background:planFilter===p?"#f0f7ff":"transparent", color:planFilter===p?"#0072c6":"#1a3a4a", fontSize:"13px", fontWeight:planFilter===p?600:400, cursor:"pointer", marginBottom:"2px" }}>{p}</button>)}
                  <p style={{ margin:"12px 0 8px", fontSize:"11px", fontWeight:700, color:"#9ab0be", textTransform:"uppercase", letterSpacing:"0.5px" }}>Status</p>
                  {STATUSES.map(s => <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"6px 10px", borderRadius:"8px", border:"none", background:statusFilter===s?"#f0f7ff":"transparent", color:statusFilter===s?"#0072c6":"#1a3a4a", fontSize:"13px", fontWeight:statusFilter===s?600:400, cursor:"pointer", marginBottom:"2px" }}>{s}</button>)}
                </div>
              )}
            </div>
            {/* Add */}
            {/* Export */}
            <button onClick={handleExportCSV} style={{ height:"36px", padding:"0 16px", border:"1.5px solid #e2eef8", borderRadius:"10px", background:"#fff", color:"#5a7a8a", fontSize:"13px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#f0f7ff"} onMouseLeave={e => e.currentTarget.style.background="#fff"}>
              <Download size={15} /> Export CSV
            </button>
            {/* Add */}
            <button onClick={openAdd} style={{ height:"36px", padding:"0 16px", border:"none", borderRadius:"10px", background:"linear-gradient(90deg,#04b8ff,#0072c6)", color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", boxShadow:"0 4px 14px rgba(0,114,198,0.3)" }}>
              <Plus size={15} /> Add Customer
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"14px", marginBottom:"20px" }}>
          {[
            { label:"Total Customers", value: data.length, color:"#0072c6", bg:"#f0f7ff" },
            { label:"Active",          value: activeCount, color:"#16a34a", bg:"#f0fdf4" },
            { label:"Inactive",        value: data.length-activeCount, color:"#9ca3af", bg:"#f9fafb" },
            { label:"Enterprise",      value: enterpriseCount, color:"#9333ea", bg:"#fdf4ff" },
          ].map(s => (
            <div key={s.label} style={{ background:"#fff", borderRadius:"14px", padding:"16px 18px", boxShadow:"0 2px 12px rgba(0,114,198,0.08)" }}>
              <div style={{ width:36, height:36, background:s.bg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"10px" }}>
                <UserCircle size={18} color={s.color} />
              </div>
              <p style={{ margin:"0 0 4px", fontSize:"11px", color:"#5a7a8a" }}>{s.label}</p>
              <p style={{ margin:0, fontSize:"22px", fontWeight:700, color:"#1a3a4a" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:"#fff", borderRadius:"16px", boxShadow:"0 2px 16px rgba(0,114,198,0.08)", overflowX:"auto" }}>
          <div style={{ minWidth: "850px" }}>
          <div style={{ display:"flex", justifyContent:"flex-end", padding:"14px 20px 0" }}>
            <span style={{ fontSize:"12px", color:"#9ab0be" }}>{filtered.length.toLocaleString()} customers</span>
          </div>

          {/* Head */}
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1.4fr 100px 90px 80px 40px", padding:"10px 20px", borderBottom:"1px solid #f0f7ff" }}>
            {["CUSTOMER","COMPANY","PLAN","STATUS","RATING",""].map((h,i) => <span key={i} style={{ fontSize:"11px", fontWeight:700, color:"#9ab0be", letterSpacing:"0.5px" }}>{h}</span>)}
          </div>

          {paginated.length === 0
            ? <div style={{ padding:"48px", textAlign:"center", color:"#9ab0be", fontSize:"14px" }}>No customers found.</div>
            : paginated.map((row, i) => {
              const pc = PLAN_COLORS[row.plan] || { bg:"#f0f7ff", color:"#0072c6" };
              return (
                <div key={row.id} className="cust-row" style={{ display:"grid", gridTemplateColumns:"2fr 1.4fr 100px 90px 80px 40px", padding:"13px 20px", borderBottom: i < paginated.length-1 ? "1px solid #f5f9ff" : "none", alignItems:"center", transition:"background 0.15s" }}>
                  {/* Customer */}
                  <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:getColor(row.name), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:"#fff", fontSize:"12px", fontWeight:700 }}>{initials(row.name)}</span>
                    </div>
                    <div>
                      <p style={{ margin:"0 0 2px", fontSize:"13px", fontWeight:600, color:"#1a3a4a" }}>{row.name}</p>
                      <p style={{ margin:0, fontSize:"11.5px", color:"#9ab0be" }}>{row.email}</p>
                    </div>
                  </div>
                  {/* Company */}
                  <div>
                    <p style={{ margin:"0 0 2px", fontSize:"13px", color:"#1a3a4a" }}>{row.company}</p>
                    <p style={{ margin:0, fontSize:"11px", color:"#9ab0be" }}>Joined {row.joined}</p>
                  </div>
                  {/* Plan */}
                  <span style={{ background:pc.bg, color:pc.color, fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"20px", whiteSpace:"nowrap" }}>{row.plan}</span>
                  {/* Status */}
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", fontWeight:500, color: row.status==="Active" ? "#16a34a" : "#9ca3af" }}>
                    {row.status==="Active" ? <CheckCircle size={13} color="#16a34a" /> : <Clock size={13} color="#9ca3af" />} {row.status}
                  </span>
                  {/* Rating */}
                  <Stars n={row.rating} />
                  {/* Actions */}
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <ActionMenu id={row.id} openId={openId} setOpenId={setOpenId} onEdit={() => openEdit(row)} onDelete={() => handleDelete(row.id)} />
                  </div>
                </div>
              );
            })
          }
          </div>

          {/* Pagination */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderTop:"1px solid #f0f7ff" }}>
            <span style={{ fontSize:"12px", color:"#9ab0be" }}>
              Showing {filtered.length===0?0:(page-1)*PAGE_SIZE+1} to {Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ padding:"6px 14px", borderRadius:"8px", border:"1.5px solid #e2eef8", background:"#fff", color:page===1?"#c0d4e4":"#1a3a4a", fontSize:"12px", cursor:page===1?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:"4px" }}>
                <ChevronLeft size={13} /> Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:"6px 14px", borderRadius:"8px", border:"1.5px solid #e2eef8", background:"#fff", color:page===totalPages?"#c0d4e4":"#1a3a4a", fontSize:"12px", cursor:page===totalPages?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:"4px" }}>
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <RightPanel open={panelOpen} onClose={() => setPanelOpen(false)} entry={editEntry} onSave={handleSave} />
    </>
  );
};

export default Customers;
