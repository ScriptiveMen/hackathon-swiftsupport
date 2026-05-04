import React, { useState, useRef, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Loader from "../common/Loader.jsx";
import {
  Search, Filter, Plus, MoreVertical, Edit2, Trash2,
  ChevronLeft, ChevronRight, X, Mail, Phone, Globe,
  CheckCircle, Clock, UserCircle, Star, Download
} from "lucide-react";

const PLANS   = ["All", "Starter", "Pro", "Enterprise"];
const STATUSES = ["All", "Active", "Inactive"];
const PAGE_SIZE = 5;

const PLAN_COLORS = {
  Starter:    { bg: "#f0fdf4", color: "#16a34a" },
  Pro:        { bg: "#eff6ff", color: "#2563eb" },
  Enterprise: { bg: "#fdf4ff", color: "#9333ea" },
};

const avatarColors = ["#0072c6","#16a34a","#d97706","#9333ea","#e11d48","#059669","#ea580c","#2563eb"];
const getColor = (name) => avatarColors[(name || "A").charCodeAt(0) % avatarColors.length];
const initials  = (name) => (name || "User").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

const Stars = ({ n }) => (
  <span style={{ display:"flex", gap:"1px" }}>
    {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i<=n?"#f59e0b":"none"} color={i<=n?"#f59e0b":"#d1d5db"} />)}
  </span>
);

/* ── Main Component ── */
const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Data Fetching
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get("/auth/users");
        setUsers(data.users || data.data || data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);


  // Filter only customers
  const customers = users?.filter(u => u.role === "customer") || [];

  const [search, setSearch]         = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]             = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const h = e => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = customers.filter(r => {
    const q = search.toLowerCase();
    const mQ = r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || "";
    // Simplified since we might not have plan/status in real user model
    return mQ;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const handleExportCSV = () => {
    if (!filtered || !filtered.length) return;
    const headers = ["Name", "Email", "Role", "Joined"];
    const rows = filtered.map(r => [r.name, r.email, r.role, new Date(r.createdAt).toLocaleDateString()]);
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

  const activeCount = customers.length; // Assume all active for now
  const enterpriseCount = 0; // Defaulting

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
            {/* Export */}
            <button onClick={handleExportCSV} style={{ height:"36px", padding:"0 16px", border:"1.5px solid #e2eef8", borderRadius:"10px", background:"#fff", color:"#5a7a8a", fontSize:"13px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#f0f7ff"} onMouseLeave={e => e.currentTarget.style.background="#fff"}>
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"14px", marginBottom:"20px" }}>
          {[
            { label:"Total Customers", value: customers.length, color:"#0072c6", bg:"#f0f7ff" },
            { label:"Active",          value: activeCount, color:"#16a34a", bg:"#f0fdf4" },
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
            {["CUSTOMER","JOINED","ROLE","STATUS","",""].map((h,i) => <span key={i} style={{ fontSize:"11px", fontWeight:700, color:"#9ab0be", letterSpacing:"0.5px" }}>{h}</span>)}
          </div>

          {loading ? (
             <div style={{ padding:"48px", textAlign:"center", color:"#9ab0be", fontSize:"14px" }}>Loading customers...</div>
          ) : paginated.length === 0
            ? <div style={{ padding:"48px", textAlign:"center", color:"#9ab0be", fontSize:"14px" }}>No customers found.</div>
            : paginated.map((row, i) => {
              return (
                <div key={row._id} className="cust-row" style={{ display:"grid", gridTemplateColumns:"2fr 1.4fr 100px 90px 80px 40px", padding:"13px 20px", borderBottom: i < paginated.length-1 ? "1px solid #f5f9ff" : "none", alignItems:"center", transition:"background 0.15s" }}>
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
                  {/* Joined */}
                  <div>
                    <p style={{ margin:0, fontSize:"11px", color:"#9ab0be" }}>Joined {new Date(row.createdAt).toLocaleDateString()}</p>
                  </div>
                  {/* Plan / Role */}
                  <span style={{ background:"#f0fdf4", color:"#16a34a", fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"20px", whiteSpace:"nowrap", textTransform: "capitalize" }}>{row.role}</span>
                  {/* Status */}
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", fontWeight:500, color: "#16a34a" }}>
                    <CheckCircle size={13} color="#16a34a" /> Active
                  </span>
                  <span></span>
                  <span></span>
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
    </>
  );
};

export default Customers;
