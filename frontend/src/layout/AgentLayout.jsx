import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Book,
  Settings,
  FileText,
  Bell,
  Cog,
  PlusCircle,
  Bot,
  Menu,
  X,
  Zap,
  HelpCircle
} from 'lucide-react';

const SidebarItem = ({ icon, text, to, onClick }) => {
  return (
    <NavLink
      to={to}
      end={to === '/agent'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 mr-4 rounded-r-full cursor-pointer transition-all duration-200 ${
          isActive
            ? 'bg-blue-50 text-[#1f88d9] font-semibold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? 'text-[#1f88d9]' : 'text-gray-400'}`}>
            {icon}
          </div>
          <span>{text}</span>
        </>
      )}
    </NavLink>
  );
};

const AgentLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans">
      <div className="flex h-screen overflow-hidden">
        
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col justify-between overflow-y-auto scrollbar-hide transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className="pt-6">
            <div className="flex items-center justify-between mb-8 px-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1f88d9] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Zap size={20} className="fill-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                  SwiftSupport
                </h1>
              </div>
              <button 
                className="lg:hidden text-gray-400 hover:text-gray-600"
                onClick={closeMobileMenu}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-1">
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
                to="/agent"
                onClick={closeMobileMenu}
              />
              <SidebarItem
                icon={<MessageSquare size={20} />}
                text="Chat"
                to="/agent/chat"
                onClick={closeMobileMenu}
              />
              <SidebarItem
                icon={<History size={20} />}
                text="Ticket history"
                to="/agent/tickets"
                onClick={closeMobileMenu}
              />
              <SidebarItem
                icon={<Book size={20} />}
                text="FAQ"
                to="/agent/faq"
                onClick={closeMobileMenu}
              />
              <SidebarItem
                icon={<FileText size={20} />}
                text="Docs"
                to="/agent/docs"
                onClick={closeMobileMenu}
              />
              <SidebarItem
                icon={<Settings size={20} />}
                text="Settings"
                to="/agent/settings"
                onClick={closeMobileMenu}
              />
            </div>
          </div>

          {/* Bottom Card */}
          <div className="p-6 mt-auto">
            <div className="bg-[#1f88d9] rounded-2xl p-6 text-white text-center shadow-lg shadow-blue-500/20 relative overflow-hidden">
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                <HelpCircle className="text-white" size={24} />
              </div>

              <h3 className="font-semibold text-lg tracking-tight mb-1">
                Quick Onboarding
              </h3>

              <p className="text-xs opacity-90 font-medium px-2 leading-relaxed">
                Set up your first AI Agent in a few simple steps.
              </p>

              <button className="bg-white text-[#1f88d9] px-6 py-2 rounded-lg mt-5 font-semibold text-sm hover:bg-gray-50 transition-colors w-full shadow-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
          
          {/* Top Navbar */}
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 md:py-5 flex justify-between items-center z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-none">
                  Overview
                </h2>
                <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">
                  Welcome to Your AI Agent Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden sm:flex items-center gap-3">
                {/* Global Search styled like the image */}
                <div className="relative mr-4 hidden md:block">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
                    placeholder="Search..."
                  />
                </div>

                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                  <Cog size={20} />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </div>

              <div className="flex items-center gap-3 cursor-pointer group ml-2">
                <div className="w-10 h-10 rounded-full bg-[#1f88d9] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  AD
                </div>
              </div>
            </div>
          </header>

          {/* Page Content Scrollable Area */}
          <main className="flex-1 overflow-y-auto relative">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;
