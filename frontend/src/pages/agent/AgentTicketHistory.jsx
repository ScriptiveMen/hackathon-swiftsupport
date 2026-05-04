import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, MoreHorizontal, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { fetchAllTickets } from "../../store/slices/ticketSlice";

const PAGE_SIZE = 5;

const AgentTicketHistory = () => {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector((state) => state.tickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
      case "open":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100"><Clock size={12} /> Open</span>;
      case "Resolved":
      case "resolved":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold border border-green-100"><CheckCircle2 size={12} /> Resolved</span>;
      case "Pending":
      case "pending":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100"><Clock size={12} /> Pending</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold capitalize">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
      case "high":
        return <span className="text-red-500 font-semibold text-sm capitalize">{priority}</span>;
      case "Medium":
      case "medium":
        return <span className="text-amber-500 font-semibold text-sm capitalize">{priority}</span>;
      case "Low":
      case "low":
        return <span className="text-gray-500 font-semibold text-sm capitalize">{priority}</span>;
      default:
        return <span className="capitalize">{priority || "—"}</span>;
    }
  };

  const filtered = (tickets || []).filter((r) => {
    const q = searchTerm.toLowerCase();
    const id = (r._id || r.ticketId || "").toString().toLowerCase();
    const subject = (r.subject || r.title || r.issue || "").toLowerCase();
    const user = (r.userName || r.userId?.name || r.customerName || "").toLowerCase();
    return id.includes(q) || subject.includes(q) || user.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Ticket History</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all customer support requests.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1f88d9] focus:ring-1 focus:ring-[#1f88d9] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-400">Loading tickets...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">No tickets found.</td>
                </tr>
              ) : (
                paginated.map((ticket) => {
                  const userName = ticket.userName || ticket.userId?.name || ticket.customerName || "Unknown";
                  const subject = ticket.subject || ticket.title || ticket.issue || "—";
                  const ticketId = ticket.ticketId || ticket._id?.slice(-6).toUpperCase() || "—";
                  const createdAt = ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString()
                    : "—";

                  return (
                    <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-[#1f88d9] cursor-pointer hover:underline">#{ticketId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1f88d9]/10 text-[#1f88d9] flex items-center justify-center font-bold text-xs">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700 font-medium">{subject}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 font-medium">{createdAt}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-[#1f88d9] p-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center">
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} results
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${safePage === i + 1 ? "border-[#1f88d9] bg-blue-50 text-[#1f88d9]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTicketHistory;
