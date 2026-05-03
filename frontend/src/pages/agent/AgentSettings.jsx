import React, { useState } from "react";
import { User, Bell, Shield, Key, Save, Upload } from "lucide-react";

const AgentSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "profile" ? 'bg-[#1f88d9] text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User size={18} className={activeTab === "profile" ? "text-white" : "text-gray-400"} />
            Profile
          </button>
          
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "notifications" ? 'bg-[#1f88d9] text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell size={18} className={activeTab === "notifications" ? "text-white" : "text-gray-400"} />
            Notifications
          </button>
          
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "security" ? 'bg-[#1f88d9] text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield size={18} className={activeTab === "security" ? "text-white" : "text-gray-400"} />
            Security & API
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8 md:p-10 bg-white">
          
          {activeTab === "profile" && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Public Profile</h2>
                <p className="text-sm text-gray-500 mt-1">This information will be displayed publicly so be careful what you share.</p>
              </div>
              
              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-blue-50 border-2 border-dashed border-[#1f88d9] flex flex-col items-center justify-center text-[#1f88d9] cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload size={24} className="mb-1" />
                    <span className="text-[10px] font-bold">UPLOAD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Avatar</h3>
                    <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <input type="text" defaultValue="Agent" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1f88d9] focus:ring-1 focus:ring-[#1f88d9] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <input type="text" defaultValue="Admin" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1f88d9] focus:ring-1 focus:ring-[#1f88d9] transition-all" />
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input type="email" defaultValue="admin@swiftsupport.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1f88d9] focus:ring-1 focus:ring-[#1f88d9] transition-all" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                <p className="text-sm text-gray-500 mt-1">Manage when and how you receive alerts.</p>
              </div>
              
              <div className="border-t border-gray-100 pt-8 space-y-6">
                {[
                  { title: "New Ticket Alerts", desc: "Receive an email when a new high-priority ticket is created.", checked: true },
                  { title: "Agent Escalations", desc: "Get notified when the AI agent cannot resolve a query.", checked: true },
                  { title: "Weekly Digest", desc: "A weekly report of your agent's performance.", checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${item.checked ? 'bg-[#1f88d9]' : 'bg-gray-200'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${item.checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Security & API Keys</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your passwords and API tokens.</p>
              </div>
              
              <div className="border-t border-gray-100 pt-8">
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Key size={16} className="text-[#1f88d9]" />
                    Active API Key
                  </h3>
                  <div className="flex gap-3">
                    <input type="password" value="sk_live_1234567890abcdef" readOnly className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 outline-none" />
                    <button className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors border border-gray-200">Reveal</button>
                    <button className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition-colors border border-red-100">Revoke</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Use this key to authenticate API requests. Do not share it publicly.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1f88d9] hover:bg-[#1a7bc4] text-white font-semibold rounded-xl text-sm shadow-sm transition-colors">
              <Save size={16} />
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgentSettings;
