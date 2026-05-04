import React, { useState, useRef, useEffect } from "react";
import {
  Search, Filter, Plus, MoreVertical, Edit2, Trash2,
  ChevronLeft, ChevronRight, X, Ticket as TicketIcon,
  AlertCircle, CheckCircle2, Clock, MessageSquare, Download
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTickets, updateTicketStatus, assignTicketToAgent } from "../../store/slices/ticketSlice";
import { fetchAgents } from "../../store/slices/authSlice";

const PRIORITIES = ["All", "Low", "Medium", "High", "Urgent"];
const STATUSES = ["All", "Open", "In Progress", "Resolved", "Closed"];
const PAGE_SIZE = 5;

const PRIORITY_COLORS = {
  "Urgent": { bg: "#fef2f2", color: "#dc2626" },
  "High":   { bg: "#fffbeb", color: "#d97706" },
  "Medium": { bg: "#f0fdf4", color: "#16a34a" },
  "Low":    { bg: "#f3f4f6", color: "#6b7280" },
};

const STATUS_COLORS = {
  "Open":        { bg: "#eff6ff", color: "#2563eb", icon: AlertCircle },
  "In Progress": { bg: "#fdf4ff", color: "#9333ea", icon: Clock },
  "Resolved":    { bg: "#f0fdf4", color: "#16a34a", icon: CheckCircle2 },
  "Closed":      { bg: "#f3f4f6", color: "#4b5563", icon: CheckCircle2 },
};

const avatarColors = ["#0072c6","#16a34a","#d97706","#9333ea","#e11d48","#059669","#ea580c","#2563eb"];
const getColor = (name) => avatarColors[name?.charCodeAt(0) % avatarColors.length || 0];
const initials  = (name) => name ? name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "?";

/* ── Right Side Panel ── */
const RightPanel = ({ open, onClose, entry, onSave, agents }) => {
  const blank = { priority: "Medium", status: "Open", assignedTo: "Unassigned" };
  const [form, setForm] = useState(blank);

  useEffect(() => { 
    setForm(entry ? { priority: entry.priority, status: entry.status, assignedTo: entry.assignedTo || "Unassigned" } : blank); 
  }, [entry, open]);

  const h = k => e => {
    setForm(f => ({...f, [k]: e.target.value}));
  };

  const inp = { width:"100%", padding:"9px 12px", border:"1.5px solid #e2eef8", borderRadius:"10px", fontSize:"13px", color:"#1a3a4a", background:"#f8fbff", outline:"none", boxSizing:"border-box", fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s", cursor: "pointer" };
  const lbl = { fontSize:"12px", fontWeight:600, color:"#5a7a8a", marginBottom:"6px", display:"block" };
  
  const handleSave = () => {
    onSave(form);
    onClose();
  };

  if (!entry) return null; // We only manage existing tickets

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.18)", zIndex:200, opacity:open?1:0, pointerEvents:open?"auto":"none", transition:"opacity 0.25s" }} />
      <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:"400px", background:"#fff", boxShadow:"-4px 0 32px rgba(0,114,198,0.12)", zIndex:300, display:"flex", flexDirection:"column", transform:open?"translateX(0)":"translateX(100%)", transition:"transform 0.3s cubic-bezier(.4,0,.2,1)" }}>
        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #e2eef8", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ margin:0, fontSize:"15px", fontWeight:700, color:"#1a3a4a" }}>Manage Ticket {entry._id?.slice(-4)}</p>
            <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#5a7a8a" }}>Update status or reassign</p>
          </div>
          <button onClick={onClose} style={{ border:"none", background:"#f0f7ff", borderRadius:"8px", cursor:"pointer", padding:"6px", display:"flex" }}>
            <X size={16} color="#5a7a8a" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          
          <div style={{ background:"#f0f7ff", borderRadius:"12px", padding:"16px", marginBottom:"24px", border:"1px solid #d0eaf9" }}>
            <p style={{ margin:"0 0 4px", fontSize:"11px", fontWeight:700, color:"#9ab0be", textTransform:"uppercase", letterSpacing:"0.5px" }}>Subject</p>
            <p style={{ margin:"0 0 12px", fontSize:"14px", fontWeight:600, color:"#1a3a4a" }}>{entry.title}</p>
            
            <p style={{ margin:"0 0 4px", fontSize:"11px", fontWeight:700, color:"#9ab0be", textTransform:"uppercase", letterSpacing:"0.5px" }}>Customer</p>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:getColor(entry.userId?.name || "Customer"), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:"#fff", fontSize:"9px", fontWeight:700 }}>{initials(entry.userId?.name || "Customer")}</span>
              </div>
              <p style={{ margin:0, fontSize:"13px", color:"#1a3a4a", fontWeight: 500 }}>{entry.userId?.name || "Customer"}</p>
            </div>
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label style={lbl}>Status</label>
            <select value={form.status} onChange={h("status")} style={inp}>
              {STATUSES.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label style={lbl}>Priority</label>
            <select value={form.priority} onChange={h("priority")} style={inp}>
              {PRIORITIES.filter(p => p !== "All").map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label style={lbl}>Assigned To</label>
            <select value={form.assignedTo} onChange={h("assignedTo")} style={inp}>
              <option>Unassigned</option>
              {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding:"16px 24px", borderTop:"1px solid #e2eef8", display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:"10px", border:"1.5px solid #e2eef8", background:"#fff", color:"#5a7a8a", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} style={{ flex:2, padding:"10px", borderRadius:"10px", border:"none", background:"linear-gradient(90deg,#04b8ff,#0072c6)", color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 12px rgba(0,114,198,0.3)" }}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Main Component ── */
export default function Tickets() {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector(state => state.tickets);
  const { agents } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAllTickets());
    dispatch(fetchAgents());
  }, [dispatch]);

  const [search, setSearch]         = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]             = useState(1);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [editEntry, setEditEntry]   = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const h = e => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Safe fallback if tickets is not an array
  const ticketsList = Array.isArray(tickets) ? tickets : [];

  const filtered = ticketsList.filter(r => {
    const q = search.toLowerCase();
    const customerName = r.userId?.name?.toLowerCase() || "";
    const title = r.title?.toLowerCase() || "";
    const mQ = r._id?.toLowerCase().includes(q) || title.includes(q) || customerName.includes(q);
    const mP = priorityFilter === "All" || r.priority === priorityFilter;
    const mS = statusFilter === "All" || r.status === statusFilter;
    return mQ && mP && mS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const handleSave = async (form) => {
    if (editEntry) {
      if (form.status !== editEntry.status) {
        await dispatch(updateTicketStatus({ id: editEntry._id, status: form.status }));
      }
      if (form.assignedTo !== editEntry.assignedTo) {
        const agentId = form.assignedTo === "Unassigned" ? null : form.assignedTo;
        // The backend expects an agentId for assignment.
        if (agentId) {
          await dispatch(assignTicketToAgent({ id: editEntry._id, agentId }));
        }
      }
      // If we had priority updates in backend we would dispatch them here too.
    }
  };

  const openEdit = row => { 
    setEditEntry(row);  
    setPanelOpen(true); 
  };

  const handleExportCSV = () => {
    if (!filtered || !filtered.length) return;
    const headers = ["Ticket ID", "Subject", "Customer", "Priority", "Status", "Assigned To", "Date"];
    const rows = filtered.map(r => [
      r._id, 
      r.title, 
      r.userId?.name || "Customer", 
      r.priority, 
      r.status, 
      agents?.find(a => a._id === r.assignedTo)?.name || "Unassigned", 
      new Date(r.createdAt).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "support_tickets_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openCount     = ticketsList.filter(r => r.status==="Open").length;
  const urgentCount   = ticketsList.filter(r => r.priority==="Urgent" || r.priority==="High").length;
  const resolvedCount = ticketsList.filter(r => r.status==="Resolved" || r.status==="Closed").length;

  return (
    <>
      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .ticket-row:hover { background:#f8fbff !important; }
        .ticket-search:focus { border-color:#0072c6 !important; outline:none; }
      `}</style>

      <div style={{ padding:"24px", minHeight:"100%", background:"#f0f7ff", fontFamily:"'Inter',sans-serif" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <h2 style={{ margin:0, fontSize:"20px", fontWeight:700, color:"#1a3a4a" }}>Support Tickets</h2>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#5a7a8a" }}>View and manage customer issues and requests.</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
            {/* Search */}
            <div style={{ position:"relative" }}>
              <Search size={14} style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", color:"#9ab0be" }} />
              <input className="ticket-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search tickets..." style={{ paddingLeft:"32px", paddingRight:"12px", height:"36px", border:"1.5px solid #e2eef8", borderRadius:"10px", fontSize:"13px", color:"#1a3a4a", background:"#fff", width:"210px", transition:"border-color 0.2s" }} />
            </div>
            {/* Filter */}
            <div ref={filterRef} style={{ position:"relative" }}>
              <button onClick={() => setFilterOpen(o => !o)} style={{ height:"36px", padding:"0 14px", border:"1.5px solid #e2eef8", borderRadius:"10px", background:"#fff", color:"#5a7a8a", fontSize:"13px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
                <Filter size={14} /> Filter
              </button>
              {filterOpen && (
                <div style={{ position:"absolute", right:0, top:"42px", background:"#fff", borderRadius:"14px", boxShadow:"0 8px 30px rgba(0,0,0,0.12)", border:"1px solid #e2eef8", padding:"16px", zIndex:100, minWidth:"200px", animation:"fadeDown 0.15s ease" }}>
                  <p style={{ margin:"0 0 8px", fontSize:"11px", fontWeight:700, color:"#9ab0be", textTransform:"uppercase", letterSpacing:"0.5px" }}>Priority</p>
                  {PRIORITIES.map(p => <button key={p} onClick={() => { setPriorityFilter(p); setPage(1); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"6px 10px", borderRadius:"8px", border:"none", background:priorityFilter===p?"#f0f7ff":"transparent", color:priorityFilter===p?"#0072c6":"#1a3a4a", fontSize:"13px", fontWeight:priorityFilter===p?600:400, cursor:"pointer", marginBottom:"2px" }}>{p}</button>)}
                  <p style={{ margin:"12px 0 8px", fontSize:"11px", fontWeight:700, color:"#9ab0be", textTransform:"uppercase", letterSpacing:"0.5px" }}>Status</p>
                  {STATUSES.map(s => <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"6px 10px", borderRadius:"8px", border:"none", background:statusFilter===s?"#f0f7ff":"transparent", color:statusFilter===s?"#0072c6":"#1a3a4a", fontSize:"13px", fontWeight:statusFilter===s?600:400, cursor:"pointer", marginBottom:"2px" }}>{s}</button>)}
                </div>
              )}
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
            { label:"Total Tickets",   value: ticketsList.length,   color:"#0072c6", bg:"#f0f7ff", Icon: TicketIcon },
            { label:"Open",            value: openCount,     color:"#2563eb", bg:"#eff6ff", Icon: MessageSquare },
            { label:"High Priority",   value: urgentCount,   color:"#dc2626", bg:"#fef2f2", Icon: AlertCircle },
            { label:"Resolved",        value: resolvedCount, color:"#16a34a", bg:"#f0fdf4", Icon: CheckCircle2 },
          ].map(s => (
            <div key={s.label} style={{ background:"#fff", borderRadius:"14px", padding:"16px 18px", boxShadow:"0 2px 12px rgba(0,114,198,0.08)" }}>
              <div style={{ width:36, height:36, background:s.bg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"10px" }}>
                <s.Icon size={18} color={s.color} />
              </div>
              <p style={{ margin:"0 0 4px", fontSize:"11px", color:"#5a7a8a" }}>{s.label}</p>
              <p style={{ margin:0, fontSize:"22px", fontWeight:700, color:"#1a3a4a" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:"#fff", borderRadius:"16px", boxShadow:"0 2px 16px rgba(0,114,198,0.08)", overflowX:"auto" }}>
          <div style={{ minWidth: "900px" }}>
          <div style={{ display:"flex", justifyContent:"flex-end", padding:"14px 20px 0" }}>
            <span style={{ fontSize:"12px", color:"#9ab0be" }}>{filtered.length.toLocaleString()} tickets</span>
          </div>

          {/* Head */}
          <div style={{ display:"grid", gridTemplateColumns:"minmax(250px,2fr) 1.2fr 100px 120px 1.2fr 60px", padding:"10px 20px", borderBottom:"1px solid #f0f7ff", gap: "10px" }}>
            {["SUBJECT","CUSTOMER","PRIORITY","STATUS","ASSIGNED TO",""].map((h,i) => <span key={i} style={{ fontSize:"11px", fontWeight:700, color:"#9ab0be", letterSpacing:"0.5px" }}>{h}</span>)}
          </div>

          {loading ? (
            <div style={{ padding:"48px", textAlign:"center", color:"#9ab0be", fontSize:"14px" }}>Loading tickets...</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding:"48px", textAlign:"center", color:"#9ab0be", fontSize:"14px" }}>No tickets found.</div>
          ) : paginated.map((row, i) => {
              const pc = PRIORITY_COLORS[row.priority] || { bg:"#f0f7ff", color:"#0072c6" };
              const sc = STATUS_COLORS[row.status] || STATUS_COLORS["Open"];
              const StatusIcon = sc.icon;
              const customerName = row.userId?.name || "Customer";
              const agentName = agents?.find(a => a._id === row.assignedTo)?.name || "Unassigned";
              
              return (
                <div key={row._id} className="ticket-row" style={{ display:"grid", gridTemplateColumns:"minmax(250px,2fr) 1.2fr 100px 120px 1.2fr 60px", padding:"13px 20px", borderBottom: i < paginated.length-1 ? "1px solid #f5f9ff" : "none", alignItems:"center", transition:"background 0.15s", gap:"10px" }}>
                  {/* Subject Info */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
                      <span style={{ fontSize:"11px", fontWeight:700, color:"#0072c6", background:"#f0f7ff", padding:"2px 6px", borderRadius:"4px" }}>{row._id?.slice(-4).toUpperCase()}</span>
                      <p style={{ margin:0, fontSize:"13px", fontWeight:600, color:"#1a3a4a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.title}</p>
                    </div>
                    <p style={{ margin:0, fontSize:"11px", color:"#9ab0be" }}>Opened {new Date(row.createdAt).toLocaleDateString()}</p>
                  </div>
                  {/* Customer */}
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:getColor(customerName), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:"#fff", fontSize:"9px", fontWeight:700 }}>{initials(customerName)}</span>
                    </div>
                    <span style={{ fontSize:"12px", color:"#1a3a4a", fontWeight:500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{customerName}</span>
                  </div>
                  {/* Priority */}
                  <div>
                    <span style={{ background:pc.bg, color:pc.color, fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"20px", whiteSpace:"nowrap" }}>{row.priority}</span>
                  </div>
                  {/* Status */}
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", fontWeight:500, color: sc.color }}>
                    <StatusIcon size={13} /> {row.status}
                  </span>
                  {/* Assigned To */}
                  <span style={{ fontSize:"12px", color:"#5a7a8a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {agentName}
                  </span>
                  {/* Actions */}
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <button onClick={() => openEdit(row)} style={{ padding:"6px 12px", border:"1.5px solid #e2eef8", background:"#fff", borderRadius:"6px", fontSize:"11.5px", fontWeight:600, color:"#0072c6", cursor:"pointer", transition:"background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#f0f7ff"} onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                      Manage
                    </button>
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

      <RightPanel open={panelOpen} onClose={() => setPanelOpen(false)} entry={editEntry} onSave={handleSave} agents={agents} />
    </>
  );
}
