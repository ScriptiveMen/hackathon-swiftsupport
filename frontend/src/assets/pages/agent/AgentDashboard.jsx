import React, { useState } from "react";
import {
  Bot,
  PlusCircle,
  MessageSquare,
  TrendingUp,
  Users,
  ChevronDown,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const AgentDashboard = () => {
  const [activePoint, setActivePoint] = useState(null);

  const stats = [
    {
      title: "Total AI Agents",
      value: "1450",
      change: "+12%",
      icon: <PlusCircle size={24} className="text-blue-500" />,
      changeColor: "text-blue-600",
      changeBg: "bg-blue-50",
    },
    {
      title: "Total Crawlers",
      value: "1450",
      change: "-5%",
      icon: <Bot size={24} className="text-indigo-500" />,
      changeColor: "text-red-500",
      changeBg: "bg-red-50",
    },
    {
      title: "Messages Sent",
      value: "12,450",
      change: "+18%",
      icon: <MessageSquare size={24} className="text-cyan-500" />,
      changeColor: "text-blue-600",
      changeBg: "bg-blue-50",
    },
    {
      title: "Conversion Rate",
      value: "18%",
      change: "Steady",
      icon: <TrendingUp size={24} className="text-blue-400" />,
      changeColor: "text-gray-500",
      changeBg: "bg-gray-100",
    },
  ];

  const chartData = [
    { label: "Jan", x: 0, y: 190 },
    { label: "Feb", x: 160, y: 170 },
    { label: "Mar", x: 320, y: 110 },
    { label: "Apr", x: 480, y: 95 },
    { label: "May", x: 640, y: 60 },
    { label: "Jun", x: 800, y: 20 },
  ];

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Top Chart Card */}
      <div className="bg-[#1f88d9] rounded-2xl p-6 text-white shadow-sm relative overflow-visible z-0">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-xl font-bold tracking-tight">
            Messages and Leads
          </h2>

          <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg cursor-pointer border border-white/5">
            <span className="text-xs font-medium">Last 6 months</span>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[240px] relative z-10 w-full font-sans">
          
          {/* Y Axis Labels & Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
            {[
              { label: "220k", y: "0%" },
              { label: "16.50k", y: "25%" },
              { label: "110k", y: "50%" },
              { label: "5.50k", y: "75%" },
              { label: "0", y: "100%" }
            ].map((item, i) => (
              <div key={i} className="relative w-full flex items-center h-0">
                <span className="absolute left-0 text-[11px] font-medium text-white/70 w-12">{item.label}</span>
                <div className="w-full ml-12 border-b border-white/10 border-dashed"></div>
              </div>
            ))}
          </div>

          {/* SVG Chart Line and Points */}
          <div className="absolute inset-0 ml-12 pb-8">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              
              {/* Vertical line for active point */}
              {chartData.map((pt) => 
                activePoint === pt.label && (
                  <line 
                    key={`v-line-${pt.label}`}
                    x1={pt.x} 
                    y1="0" 
                    x2={pt.x} 
                    y2="200" 
                    stroke="white" 
                    strokeWidth="1.5" 
                    opacity="0.8"
                  />
                )
              )}

              {/* The Line */}
              <polyline
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-line"
                points={chartData.map(pt => `${pt.x},${pt.y}`).join(' ')}
              />
              
              {/* Points & Interactive Areas */}
              {chartData.map((pt) => {
                const isActive = activePoint === pt.label;
                return (
                  <g 
                    key={pt.label} 
                    className="cursor-pointer" 
                    onMouseEnter={() => setActivePoint(pt.label)}
                    onMouseLeave={() => setActivePoint(null)}
                  >
                    {/* Invisible larger circle for easier clicking */}
                    <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />
                    
                    {/* Visible point */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isActive ? "8" : "4"} 
                      fill="white" 
                      className={`transition-all duration-300 ${isActive ? 'drop-shadow-md' : 'drop-shadow-sm'}`} 
                    />
                  </g>
                );
              })}
            </svg>

            {/* HTML Tooltip mapped to coordinates for better rendering */}
            {chartData.map((pt) => {
              if (activePoint !== pt.label) return null;
              
              // Calculate percentage position
              const leftPercent = (pt.x / 800) * 100;
              // Tooltip positioning offset
              const isFarRight = leftPercent > 80;
              
              return (
                <div 
                  key={`tooltip-${pt.label}`}
                  className="absolute z-20 bg-white text-slate-800 rounded-xl shadow-xl px-5 py-4 min-w-[120px] transition-all duration-300 animate-fade-in-up"
                  style={{
                    left: `${leftPercent}%`,
                    top: `calc(${(pt.y / 200) * 100}% - 10px)`,
                    transform: `translate(${isFarRight ? '-110%' : '20px'}, -50%)`
                  }}
                >
                  <p className="font-semibold text-sm">{pt.label}</p>
                  {/* Additional info could go here, for now matching image */}
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="absolute bottom-0 ml-12 w-[calc(100%-3rem)] flex justify-between text-[11px] font-medium text-white/80">
            {chartData.map((pt) => (
              <span 
                key={pt.label} 
                className={`-ml-2 cursor-pointer transition-colors ${activePoint === pt.label ? 'text-white font-bold' : 'hover:text-white'}`}
                onMouseEnter={() => setActivePoint(pt.label)}
                onMouseLeave={() => setActivePoint(null)}
              >
                {pt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
              {item.icon}
            </div>

            <p className="text-gray-500 text-sm font-medium mb-1">
              {item.title}
            </p>

            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                {item.value}
              </h3>

              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${item.changeBg} ${item.changeColor}`}>
                {item.change.startsWith('+') ? '▲' : item.change.startsWith('-') ? '▼' : ''} {item.change.replace(/[+-]/, '')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Sections (FAQ, Chat, Ticket History) as requested */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Chat Preview */}
        <div className="bg-white border border-gray-100 rounded-[28px] p-7 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800">Recent Chats</h3>
            <Link to="/agent/chat" className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { name: "John Doe", msg: "I need help with my billing...", time: "2m ago", active: true },
              { name: "Sarah Smith", msg: "How do I setup a crawler?", time: "15m ago", active: false },
              { name: "Mike Johnson", msg: "Thanks for the support!", time: "1h ago", active: false }
            ].map((chat, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.active && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">{chat.name}</h4>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{chat.msg}</p>
                </div>
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{chat.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket History Preview */}
        <div className="bg-white border border-gray-100 rounded-[28px] p-7 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800">Ticket History</h3>
            <Link to="/agent/tickets" className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { id: "#T-4092", status: "Open", title: "API Integration issue", priority: "High" },
              { id: "#T-4091", status: "Resolved", title: "Login not working", priority: "Medium" },
              { id: "#T-4090", status: "Pending", title: "Billing adjustment", priority: "Low" }
            ].map((ticket, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{ticket.id}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    ticket.status === 'Open' ? 'bg-amber-50 text-amber-600' :
                    ticket.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>{ticket.status}</span>
                </div>
                <p className="text-sm font-medium text-slate-800">{ticket.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick FAQ / Knowledge Base */}
        <div className="bg-white border border-gray-100 rounded-[28px] p-7 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800">Quick FAQ</h3>
            <Link to="/agent/knowledge-base" className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
              Knowledge Base <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              "How to add a new AI Agent?",
              "What are the rate limits for the API?",
              "Can I export my chat history?",
              "How to configure web crawlers?"
            ].map((faq, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <HelpCircle size={16} />
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{faq}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Need more help?</p>
                <p className="text-xs text-gray-500 mt-0.5">Ask our AI Support Agent</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentDashboard;
