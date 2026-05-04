import React, { useState } from "react";
import { Search, Filter, MoreHorizontal, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

const SEED_TICKETS = [
  { id: "#T-4092", user: "Acme Corp", subject: "API Integration failing on prod", status: "Open", priority: "High", date: "Today, 10:30 AM" },
  { id: "#T-4091", user: "John Smith", subject: "Billing adjustment required", status: "Resolved", priority: "Medium", date: "Yesterday" },
  { id: "#T-4090", user: "Sarah Lee", subject: "Cannot add new agents", status: "Pending", priority: "High", date: "Oct 24, 2023" },
  { id: "#T-4089", user: "TechFlow Inc", subject: "Crawler rate limits reached", status: "Resolved", priority: "Low", date: "Oct 22, 2023" },
  { id: "#T-4088", user: "Mike Johnson", subject: "Need help with custom prompts", status: "Open", priority: "Medium", date: "Oct 20, 2023" },
];

// Generate 24 dummy tickets for pagination
const dummyTickets = Array.from({ length: 24 }).map((_, i) => {
  const template = SEED_TICKETS[i % SEED_TICKETS.length];
  return { ...template, id: `#T-${4092 - i}` };
});

const PAGE_SIZE = 5;

const AgentTicketHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100"><Clock size={12}/> {status}</span>;
      case 'Resolved':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold border border-green-100"><CheckCircle2 size={12}/> {status}</span>;
      case 'Pending':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100"><Clock size={12}/> {status}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="text-red-500 font-semibold text-sm">{priority}</span>;
      case 'Medium':
        return <span className="text-amber-500 font-semibold text-sm">{priority}</span>;
      case 'Low':
        return <span className="text-gray-500 font-semibold text-sm">{priority}</span>;
      default:
        return <span>{priority}</span>;
    }
  };

  const filtered = dummyTickets.filter(r => {
    const q = searchTerm.toLowerCase();
    return r.id.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.user.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  
  // Prevent page going out of bounds when searching
  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User / Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">No tickets found.</td>
                </tr>
              ) : (
                paginated.map((ticket, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#1f88d9] cursor-pointer hover:underline">{ticket.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1f88d9]/10 text-[#1f88d9] flex items-center justify-center font-bold text-xs">
                          {ticket.user.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{ticket.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">{ticket.subject}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 font-medium">{ticket.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-[#1f88d9] p-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} results
          </p>
          <div className="flex gap-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${page === i + 1 ? 'border-[#1f88d9] bg-blue-50 text-[#1f88d9]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
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
