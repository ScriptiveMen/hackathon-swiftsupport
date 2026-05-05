import React, { useState, useRef, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Loader from "../common/Loader.jsx";
import {
  Search, Filter, Plus, MoreVertical, Edit2, Copy, Trash2, X, ChevronLeft,
  ChevronRight, CheckCircle, Clock, Tag, BookOpen, Download, AlertCircle, Upload, FileText, Trash,
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useSearch } from "../../context/SearchContext.jsx";


const Toast = ({ show, message, type = "success", onClose }) => {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!show) return null;

  const isError = type === "error";
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        background: isError ? "#fff1f2" : "#f0fdf4",
        color: isError ? "#e11d48" : "#16a34a",
        padding: "12px 20px",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 9999,
        border: `1px solid ${isError ? "#fda4af" : "#bbf7d0"}`,
        animation: "fadeUp 0.3s ease",
      }}
    >
      {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
      <span style={{ fontSize: "14px", fontWeight: 600 }}>{message}</span>
    </div>
  );
};

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

/* ── Bulk Upload Modal ─────────────────────────────────────────── */
const BulkUploadModal = ({ open, onClose, onUpload, showToast }) => {
  const [fileData, setFileData] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const VALID_CATEGORIES = [
    "Login & Security", "Billing", "User Management", "API & Dev",
    "Integrations", "Export", "AI & Bot", "Customization", "Analytics"
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    setLoading(true);

    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          validateAndSet(results.data);
          setLoading(false);
        },
      });
    } else if (extension === "xlsx" || extension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        validateAndSet(json);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else if (extension === "json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          validateAndSet(Array.isArray(json) ? json : [json]);
        } catch (err) {
          showToast("Invalid JSON file", "error");
        }
        setLoading(false);
      };
      reader.readAsText(file);
    } else {
      showToast("Unsupported file format. Please use CSV, Excel, or JSON.", "error");
      setLoading(false);
    }
  };

  const validateAndSet = (data) => {
    const validated = data.map((item, index) => {
      const question = item.Question || item.question || "";
      const answer = item.Answer || item.answer || "";
      const variant = item.Variant || item.variant || "";
      const category = item.Category || item.category || "Billing";
      const status = item.Status || item.status || "Pending";

      const errors = [];
      if (!question) errors.push("Missing question");
      if (!answer) errors.push("Missing answer");
      if (!VALID_CATEGORIES.includes(category)) errors.push("Invalid category");

      return {
        id: index,
        question,
        answer,
        variant,
        category,
        status,
        errors,
      };
    });
    setFileData(validated);
  };

  const removeRow = (id) => {
    setFileData(prev => prev.filter(row => row.id !== id));
  };

  const handleFinalUpload = () => {
    const validRows = fileData.filter(row => row.errors.length === 0);
    if (validRows.length === 0) {
      showToast("No valid rows to upload.", "error");
      return;
    }
    onUpload(validRows);
    setFileData([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#fff", width: "100%", maxWidth: "900px", maxHeight: "90vh", borderRadius: "20px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        
        {/* Header */}
        <div style={{ padding: "24px", borderBottom: "1px solid #f0f7ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1a3a4a" }}>Bulk Upload FAQs</h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5a7a8a" }}>Upload CSV, Excel, or JSON files to import multiple entries.</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f0f7ff", borderRadius: "10px", padding: "8px", cursor: "pointer", color: "#5a7a8a" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {fileData.length === 0 ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{
                height: "300px", border: "2px dashed", borderColor: dragActive ? "#04b8ff" : "#e2eef8",
                borderRadius: "16px", background: dragActive ? "#f0fbff" : "#f8fbff",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => processFile(e.target.files[0])} style={{ display: "none" }} accept=".csv,.xlsx,.xls,.json" />
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(0,114,198,0.1)", marginBottom: "16px" }}>
                <Upload size={28} color="#04b8ff" />
              </div>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#1a3a4a" }}>Drop your file here or click to browse</p>
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#5a7a8a" }}>Supports CSV, XLSX, XLS, and JSON</p>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#5a7a8a" }}>{fileData.length} entries found</span>
                <button onClick={() => setFileData([])} style={{ border: "none", background: "transparent", color: "#ef4444", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Trash size={14} /> Clear All
                </button>
              </div>
              
              <div style={{ border: "1px solid #e2eef8", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead style={{ background: "#f8fbff", borderBottom: "1px solid #e2eef8" }}>
                    <tr>
                      <th style={{ padding: "12px", textAlign: "left", color: "#5a7a8a", fontWeight: 600 }}>Question</th>
                      <th style={{ padding: "12px", textAlign: "left", color: "#5a7a8a", fontWeight: 600 }}>Answer</th>
                      <th style={{ padding: "12px", textAlign: "left", color: "#5a7a8a", fontWeight: 600 }}>Status</th>
                      <th style={{ padding: "12px", width: "40px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.map((row) => (
                      <tr key={row.id} style={{ borderBottom: "1px solid #f8fbff", background: row.errors.length > 0 ? "#fff1f2" : "#fff" }}>
                        <td style={{ padding: "12px" }}>
                          <div style={{ fontWeight: 600, color: "#1a3a4a" }}>{row.question || "(Empty)"}</div>
                          {row.errors.length > 0 && <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{row.errors.join(", ")}</div>}
                        </td>
                        <td style={{ padding: "12px", color: "#5a7a8a" }}>
                          <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.answer || "(Empty)"}</div>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "3px 8px", borderRadius: "20px", background: "#f0f7ff", color: "#0072c6", fontSize: "11px", fontWeight: 600 }}>{row.category}</span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <button onClick={() => removeRow(row.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f7ff", display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e2eef8", background: "#fff", color: "#5a7a8a", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleFinalUpload}
            disabled={fileData.length === 0}
            style={{ flex: 2, padding: "10px", borderRadius: "10px", border: "none", background: fileData.length === 0 ? "#cbd5e1" : "linear-gradient(90deg,#04b8ff,#0072c6)", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: fileData.length === 0 ? "not-allowed" : "pointer", boxShadow: fileData.length === 0 ? "none" : "0 4px 12px rgba(0,114,198,0.3)" }}
          >
            Confirm Upload {fileData.length > 0 && `(${fileData.filter(r => r.errors.length === 0).length} valid)`}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

/* ── Delete Confirmation Modal ───────────────────────────────────── */
const DeleteConfirmModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#fff", width: "100%", maxWidth: "400px", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", overflow: "hidden", animation: "modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Trash2 size={24} color="#e11d48" />
          </div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1a3a4a" }}>Delete FAQ?</h3>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#5a7a8a", lineHeight: 1.5 }}>
            Are you sure you want to delete this FAQ entry? This action cannot be undone.
          </p>
        </div>
        <div style={{ padding: "16px 24px", background: "#f8fbff", display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e2eef8", background: "#fff", color: "#5a7a8a", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#e11d48", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(225,29,72,0.3)" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Right Panel ─────────────────────────────────────────────────── */
const RightPanel = ({ open, onClose, entry, onSave }) => {
  const [form, setForm] = useState({ question: "", variant: "", answer: "", category: "Billing", status: "Synced" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entry) setForm({ question: entry.question, variant: entry.variant || "", answer: entry.answer || "", category: entry.category || "Billing", status: entry.status || "Synced" });
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
              onBlur={e => { e.target.style.borderColor = "#e2eef8" }}
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
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              onEdit();
              setOpenId(null);
            }}
            style={menuBtnStyle("#1a3a4a")}
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              onDuplicate();
              setOpenId(null);
            }}
            style={menuBtnStyle("#1a3a4a")}
          >
            <Copy size={13} /> Duplicate
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
            style={menuBtnStyle("#ef4444")}
          >
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

/* ── Main Component ──────────────────────────────────────────────── */
const FAQ = () => {
  const { searchTerm } = useSearch();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Data Fetching
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get("/knowledge/getAllFAQ");
        setFaqs(data.data || data.faqs || data);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const filterRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (searchTerm !== undefined) {
      setSearch(searchTerm);
      setPage(1);
    }
  }, [searchTerm]);

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Filter */
  const filtered = (faqs || []).filter(r => {
    const q = search.toLowerCase();
    const matchQ = (r.question?.toLowerCase() || "").includes(q) || (r.variant?.toLowerCase() || "").includes(q);
    const matchC = catFilter === "All" || r.category === catFilter;
    const matchS = statusFilter === "All" || r.status === statusFilter;
    return matchQ && matchC && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Actions */
  const handleSave = async (form) => {
    try {
      if (editEntry) {
        await axiosClient.put(`/knowledge/updateFAQ/${editEntry._id}`, form);
        showToast("Entry updated successfully!");
      } else {
        await axiosClient.post("/knowledge/createFAQ", form);
        showToast("Entry added successfully!");
      }
      // Refresh
      const { data } = await axiosClient.get("/knowledge/getAllFAQ");
      setFaqs(data.data || data.faqs || data);
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed.", "error");
    }
    setPage(1);
  };

  const handleBulkUpload = async (faqsToUpload) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.post("/knowledge/bulkUpload", { faqs: faqsToUpload });
      showToast(data.message || "Bulk upload successful!");
      
      // Refresh
      const refresh = await axiosClient.get("/knowledge/getAllFAQ");
      setFaqs(refresh.data.data || refresh.data.faqs || refresh.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Bulk upload failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (row) => {
    const copyForm = {
      question: row.question + " (copy)",
      variant: row.variant,
      category: row.category,
      answer: row.answer,
      status: "Pending"
    };
    try {
      await axiosClient.post("/knowledge/createFAQ", copyForm);
      showToast("Entry duplicated!");
      // Refresh
      const { data } = await axiosClient.get("/knowledge/getAllFAQ");
      setFaqs(data.data || data.faqs || data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to duplicate.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axiosClient.delete(`/knowledge/deleteFAQ/${itemToDelete}`);
      showToast("Entry deleted.");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      // Refresh
      const { data } = await axiosClient.get("/knowledge/getAllFAQ");
      setFaqs(data.data || data.faqs || data);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const openAdd = () => {
    setEditEntry(null);
    setPanelOpen(true);
  };
  const openEdit = (row) => {
    // Clone to prevent direct state mutation
    setTimeout(() => {
      setEditEntry({ ...row });
      setPanelOpen(true);
    }, 10);
  };

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
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) translateX(-50%); } to { opacity:1; transform:translateY(0) translateX(-50%); } }
        .faq-row:hover { background: #f8fbff !important; }
        .faq-search:focus { border-color: #0072c6 !important; outline: none; }
      `}</style>

      <div style={{ padding: "24px", minHeight: "100%", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", gap: "16px" }}>
          <div style={{ minWidth: "fit-content" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#1a3a4a", letterSpacing: "-0.5px" }}>AI Training Dataset</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "nowrap", flex: 1, justifyContent: "flex-end" }}>
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
            {/* Bulk Upload */}
            <button onClick={() => setBulkModalOpen(true)} style={{ height:"36px", padding:"0 16px", border:"1.5px solid #e2eef8", borderRadius:"10px", background:"#fff", color:"#5a7a8a", fontSize:"13px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="#f0f7ff"} onMouseLeave={e => e.currentTarget.style.background="#fff"}>
              <Upload size={15} /> Upload Dataset
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
          {loading ? (
             <div style={{ padding: "48px", textAlign: "center", color: "#9ab0be", fontSize: "14px" }}>Loading entries...</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#9ab0be", fontSize: "14px" }}>
              No entries found. Try adjusting your filters.
            </div>
          ) : paginated.map((row, i) => (
            <div
              key={row._id}
              className="faq-row"
              style={{ display: "grid", gridTemplateColumns: "1fr 160px 130px 40px", padding: "14px 20px", borderBottom: i < paginated.length - 1 ? "1px solid #f5f9ff" : "none", alignItems: "center", transition: "background 0.15s" }}
            >
              {/* Question & Variant */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", overflow: "hidden" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a3a4a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "60%" }}>
                  {row.question}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#9ab0be", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ fontWeight: 500, color: "#cbd5e1", marginRight: "4px" }}>|</span> {row.variant}
                </p>
              </div>
              {/* Category */}
              <div><CategoryBadge cat={row.category} /></div>
              {/* Status */}
              <div><StatusBadge status={row.status} /></div>
              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ActionMenu
                  id={row._id}
                  openId={openId}
                  setOpenId={setOpenId}
                  onEdit={() => openEdit(row)}
                  onDuplicate={() => handleDuplicate(row)}
                  onDelete={() => handleDelete(row._id)}
                  openUp={i >= paginated.length - 2}
                />
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

      {/* ── Bulk Upload Modal ── */}
      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onUpload={handleBulkUpload}
        showToast={showToast}
      />

      {/* ── Delete Confirmation Modal ── */}
      <DeleteConfirmModal
        open={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setItemToDelete(null); }}
        onConfirm={confirmDelete}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
};

export default FAQ;
