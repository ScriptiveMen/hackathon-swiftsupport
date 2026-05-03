import React, { useState } from "react";
import { BookOpen, Code, Terminal, Zap, FileJson, Link as LinkIcon } from "lucide-react";

const dummyDocs = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Zap size={18} />,
    content: `
# Quick Start Guide

Welcome to SwiftSupport! This guide will help you set up your first AI Agent in minutes.

### 1. Create an Agent
Navigate to the dashboard and click **"Add Agent"**. Provide a name and a base prompt that defines the agent's persona.

### 2. Add Knowledge
Your agent needs context to answer questions accurately. You can add knowledge by:
- Uploading PDF or TXT files.
- Providing website URLs for our crawler to scrape.
- Manually entering text snippets.

### 3. Deploy
Once configured, you'll receive a unique API key and a code snippet to embed the chat widget directly into your application.
    `
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: <Code size={18} />,
    content: `
# REST API

Integrate SwiftSupport deeply into your application using our REST API.

### Authentication
All API requests require a Bearer token in the Authorization header.
\`\`\`http
Authorization: Bearer YOUR_API_KEY
\`\`\`

### Send a Message
\`POST /v1/chat/message\`

**Request Body:**
\`\`\`json
{
  "agent_id": "ag_12345",
  "message": "How do I reset my password?",
  "session_id": "user_session_99"
}
\`\`\`

**Response:**
\`\`\`json
{
  "response": "To reset your password, go to settings > security.",
  "confidence": 0.95
}
\`\`\`
    `
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: <LinkIcon size={18} />,
    content: `
# Webhooks

Set up webhooks to receive real-time notifications about events happening in your SwiftSupport account.

### Supported Events
- \`ticket.created\`: Fired when an AI agent escalates a chat to a human agent.
- \`chat.ended\`: Fired when a user closes the chat session.
- \`crawler.finished\`: Fired when a website crawl completes successfully.

Configure your webhook endpoints in the **Settings > API & Integrations** tab.
    `
  }
];

const AgentDocs = () => {
  const [activeDoc, setActiveDoc] = useState(dummyDocs[0]);

  // A very simple markdown-to-html renderer for dummy content
  const renderMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-slate-800 mb-6 mt-4">{line.replace('# ', '')}</h1>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-4">{line.replace('### ', '')}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc text-gray-600 mb-2">{line.replace('- ', '')}</li>;
      if (line.startsWith('```')) return null; // Simplified code block handling
      if (line.startsWith('{') || line.startsWith('}')) return <pre key={i} className="bg-slate-800 text-green-400 p-2 text-sm font-mono">{line}</pre>;
      if (line.includes('Authorization:')) return <pre key={i} className="bg-slate-800 text-blue-300 p-4 rounded-lg text-sm font-mono mb-4">{line}</pre>;
      if (line.includes('"')) return <pre key={i} className="bg-slate-800 text-green-400 px-4 py-1 text-sm font-mono">{line}</pre>;
      if (line.trim() === '') return <br key={i} />;
      
      // Inline bold and code formatting (very basic)
      let formattedLine = line;
      if (formattedLine.includes('**')) {
        const parts = formattedLine.split('**');
        return <p key={i} className="text-gray-600 leading-relaxed mb-4">{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-slate-800 font-bold">{p}</strong> : p)}</p>;
      }
      if (formattedLine.includes('\`')) {
        const parts = formattedLine.split('\`');
        return <p key={i} className="text-gray-600 leading-relaxed mb-4">{parts.map((p, j) => j % 2 === 1 ? <code key={j} className="bg-gray-100 text-pink-500 px-1.5 py-0.5 rounded text-sm font-mono">{p}</code> : p)}</p>;
      }

      return <p key={i} className="text-gray-600 leading-relaxed mb-4">{line}</p>;
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] p-4 md:p-8 animate-fade-in-up">
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm flex h-full overflow-hidden">
        
        {/* Sidebar Nav */}
        <div className="w-64 border-r border-gray-100 bg-gray-50/50 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen size={20} className="text-[#1f88d9]" />
              Documentation
            </h2>
          </div>
          
          <div className="p-4 space-y-1 overflow-y-auto">
            {dummyDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeDoc.id === doc.id 
                  ? 'bg-[#1f88d9] text-white shadow-md shadow-blue-500/20' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-slate-800'
                }`}
              >
                <div className={activeDoc.id === doc.id ? 'text-white' : 'text-gray-400'}>
                  {doc.icon}
                </div>
                {doc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-hide bg-white">
          <div className="max-w-3xl">
            {renderMarkdown(activeDoc.content)}
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-400">Last updated: 2 days ago</p>
            <div className="flex gap-2">
              <button className="text-sm font-medium text-gray-500 hover:text-[#1f88d9] transition-colors">Was this helpful?</button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AgentDocs;
