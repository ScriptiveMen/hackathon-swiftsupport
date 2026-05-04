import React, { useState } from "react";
import { BookOpen, Bot, Users, Ticket, CheckCircle2, FileText, Settings, Zap } from "lucide-react";

const MODULES = [
  {
    id: "overview",
    title: "System Overview",
    icon: BookOpen,
    content: (
      <>
        <h2>Welcome to SwiftSupport Docs</h2>
        <p>This admin panel is the central command center for your entire customer support operation. From here, you can manage your human staff, oversee customer accounts, build your AI's knowledge base, and monitor live support tickets.</p>
        
        <h3>Key Sections</h3>
        <div className="doc-grid">
          <div className="doc-card">
            <Users size={20} color="#0072c6" />
            <h4>Agents</h4>
            <p>Create and manage accounts for your human support staff.</p>
          </div>
          <div className="doc-card">
            <Bot size={20} color="#16a34a" />
            <h4>FAQ Knowledge Base</h4>
            <p>Feed questions and answers into the AI for automated support.</p>
          </div>
          <div className="doc-card">
            <Ticket size={20} color="#d97706" />
            <h4>Live Tickets</h4>
            <p>Monitor escalated chats waiting for human assistance.</p>
          </div>
        </div>
      </>
    )
  },
  {
    id: "agents",
    title: "How to Create an Agent",
    icon: Users,
    content: (
      <>
        <h2>Managing Support Agents</h2>
        <p>To allow your staff to handle customer queries, you must first create an Agent account for them.</p>

        <h3>Step-by-Step Guide</h3>
        <ul className="timeline">
          <li>
            <strong>1. Navigate to the Agents Panel</strong>
            <p>Click on <b>"Agents"</b> in the left-hand navigation sidebar.</p>
          </li>
          <li>
            <strong>2. Click "Add Agent"</strong>
            <p>Click the blue <b>"Add Agent"</b> button in the top right corner. A panel will slide in from the right.</p>
          </li>
          <li>
            <strong>3. Fill in the Details</strong>
            <p>Enter the staff member's Full Name, Email, exact 10-digit Phone Number, and create a strong Password for them. Select their Department and Role.</p>
          </li>
          <li>
            <strong>4. Save Changes</strong>
            <p>Click "Save Changes". The agent can now log in using these credentials and start receiving live chats!</p>
          </li>
        </ul>
      </>
    )
  },
  {
    id: "faq",
    title: "How to Create an FAQ",
    icon: FileText,
    content: (
      <>
        <h2>Feeding Your AI</h2>
        <p>The AI Agent automatically resolves queries by reading your FAQ Knowledge Base. Here is how to teach it new things.</p>
        
        <h3>Step-by-Step Guide</h3>
        <ul className="timeline">
          <li>
            <strong>1. Navigate to FAQ</strong>
            <p>Click on <b>"FAQ"</b> in the left-hand navigation sidebar.</p>
          </li>
          <li>
            <strong>2. Add a New Question</strong>
            <p>Click the <b>"Add FAQ"</b> button. The creation panel will slide in.</p>
          </li>
          <li>
            <strong>3. Write the Q&A</strong>
            <p>Type in the exact <b>Question</b> a customer might ask (e.g., "How do I reset my password?"). Then, write the precise <b>Answer</b> you want the AI to give them.</p>
          </li>
          <li>
            <strong>4. Select a Category</strong>
            <p>Assign it to a category like "Billing" or "Technical" so your knowledge base stays organized.</p>
          </li>
        </ul>
      </>
    )
  },
  {
    id: "chat-flow",
    title: "Live Chat Handoff Flow",
    icon: Bot,
    content: (
      <>
        <h2>How the Live Chat Works</h2>
        <p>Our system uses a hybrid approach, combining the speed of AI with the empathy of human agents.</p>
        
        <ul className="timeline">
          <li>
            <strong>1. AI Attempts to Resolve</strong>
            <p>When a customer asks a question, the AI searches your <b>FAQ Knowledge Base</b> to answer instantly.</p>
          </li>
          <li>
            <strong>2. Ticket Escalation</strong>
            <p>If the AI cannot solve the problem, it raises a <b>Ticket</b>. This acts as a live request for a human agent.</p>
          </li>
          <li>
            <strong>3. Human Handoff</strong>
            <p>An agent accepts the ticket and is dropped directly into the live chat to resolve the issue.</p>
          </li>
        </ul>
      </>
    )
  },
  {
    id: "routing",
    title: "Agent Routing Logic",
    icon: Zap,
    content: (
      <>
        <h2>Smart Agent Routing</h2>
        <p>When a ticket is raised, how does the system know which agent to send it to?</p>
        
        <div className="status-box">
          <div className="status-item">
            <span className="badge badge-active"><CheckCircle2 size={12}/> Active</span>
            <p>The agent is online and ready. The system <b>will</b> route new chat tickets to them.</p>
          </div>
          <div className="status-item">
            <span className="badge badge-inactive">Inactive</span>
            <p>The agent is either currently busy talking to someone else, or they are offline. The system <b>skips</b> them.</p>
          </div>
          <div className="status-item">
            <span className="badge badge-leave">On Leave</span>
            <p>The agent is out of the office. The system <b>skips</b> them.</p>
          </div>
        </div>
      </>
    )
  }
];

export default function Docs() {
  const [activeId, setActiveId] = useState(MODULES[0].id);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeModule = MODULES.find(m => m.id === activeId);

  const handleSelect = (id) => {
    if (id === activeId) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveId(id);
      setIsAnimating(false);
    }, 150); // Matches the CSS transition duration
  };

  return (
    <div style={{ padding: "24px", minHeight: "100%", background: "#f0f7ff", fontFamily: "'Inter',sans-serif", display:"flex", flexDirection:"column" }}>
      
      {/* Dynamic Styles injected for the Docs page */}
      <style>{`
        .docs-container {
          display: flex;
          gap: 24px;
          flex: 1;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,114,198,0.06);
          overflow: hidden;
          min-height: calc(100vh - 120px);
        }
        
        .docs-sidebar {
          width: 260px;
          background: #f8fbff;
          border-right: 1px solid #e2eef8;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .doc-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #5a7a8a;
          font-size: 13.5px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .doc-nav-btn:hover {
          background: #f0f7ff;
          color: #0072c6;
        }

        .doc-nav-btn.active {
          background: linear-gradient(90deg, #04b8ff, #0072c6);
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,114,198,0.25);
        }

        .docs-content-wrapper {
          flex: 1;
          padding: 40px 60px;
          overflow-y: auto;
        }

        .docs-content {
          max-width: 720px;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .docs-content.fading {
          opacity: 0;
          transform: translateY(10px);
        }

        .docs-content.entering {
          opacity: 1;
          transform: translateY(0);
        }

        /* Markdown Styling Defaults */
        .docs-content h2 { margin: 0 0 16px; font-size: 26px; font-weight: 700; color: #1a3a4a; letter-spacing: -0.5px; }
        .docs-content h3 { margin: 32px 0 12px; font-size: 18px; font-weight: 600; color: #0072c6; border-bottom: 1px solid #e2eef8; padding-bottom: 8px; }
        .docs-content h4 { margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #1a3a4a; }
        .docs-content p { margin: 0 0 16px; font-size: 14.5px; color: #4a6a7a; line-height: 1.7; }
        .docs-content b, .docs-content strong { color: #1a3a4a; font-weight: 600; }
        .docs-content ul { padding-left: 20px; margin-bottom: 24px; color: #4a6a7a; }
        .docs-content li { margin-bottom: 10px; font-size: 14.5px; line-height: 1.6; }

        /* Custom Components */
        .doc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px; }
        .doc-card { padding: 20px; background: #f8fbff; border: 1px solid #e2eef8; border-radius: 12px; transition: transform 0.2s; }
        .doc-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,114,198,0.08); }
        .doc-card p { font-size: 13px; margin: 0; }

        .timeline { list-style: none; padding: 0; margin: 24px 0; border-left: 2px solid #e2eef8; margin-left: 8px; }
        .timeline li { position: relative; padding-left: 24px; margin-bottom: 24px; }
        .timeline li::before { content: ''; position: absolute; left: -7px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #0072c6; border: 3px solid #fff; box-shadow: 0 0 0 1px #e2eef8; }
        .timeline p { margin: 4px 0 0; font-size: 14px; }

        .status-box { background: #f8fbff; border-radius: 12px; border: 1px solid #e2eef8; padding: 20px; margin: 24px 0; display: flex; flex-direction: column; gap: 16px; }
        .status-item { display: flex; flex-direction: column; gap: 6px; }
        .status-item p { margin: 0; font-size: 13px; }
        
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; width: fit-content; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-active { background: #f0fdf4; color: #16a34a; }
        .badge-inactive { background: #fef2f2; color: #dc2626; }
        .badge-leave { background: #f3f4f6; color: #6b7280; }
      `}</style>

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1a3a4a" }}>Documentation</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5a7a8a" }}>Learn how to manage and optimize your support operations.</p>
      </div>

      <div className="docs-container">
        
        {/* Left Sidebar Navigation */}
        <div className="docs-sidebar">
          <p style={{ margin: "0 0 12px 14px", fontSize: "11px", fontWeight: 700, color: "#9ab0be", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Modules
          </p>
          {MODULES.map((mod) => {
            const isActive = activeId === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelect(mod.id)}
                className={`doc-nav-btn ${isActive ? 'active' : ''}`}
              >
                <mod.icon size={16} />
                {mod.title}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="docs-content-wrapper">
          <div className={`docs-content ${isAnimating ? 'fading' : 'entering'}`}>
            {activeModule.content}
          </div>
        </div>

      </div>

    </div>
  );
}
