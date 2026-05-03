import React, { useState } from "react";
import { ChevronDown, Search, MessageCircleQuestion } from "lucide-react";

const dummyFaqs = [
  {
    category: "General",
    questions: [
      { q: "How do I add a new AI Agent?", a: "Navigate to the Settings tab, click on 'Manage Agents', and select 'Add New'. You can then configure the agent's prompt, knowledge base, and model settings." },
      { q: "What languages does the AI support?", a: "Currently, our models support over 50 languages including English, Spanish, French, German, and Mandarin. You can set the primary language in Agent Settings." },
    ]
  },
  {
    category: "Billing & Plans",
    questions: [
      { q: "How are messages counted towards my limit?", a: "A single message includes one user input and one AI response. If your agent is extremely verbose, it still counts as one message. Rate limits apply per minute." },
      { q: "Can I upgrade my plan mid-month?", a: "Yes! If you upgrade, the amount will be prorated for the remainder of the month. Downgrades take effect at the start of the next billing cycle." },
    ]
  },
  {
    category: "Technical & API",
    questions: [
      { q: "What is the rate limit for the REST API?", a: "The standard API rate limit is 100 requests per minute per IP address. For enterprise plans, this limit is increased to 1000 RPM." },
      { q: "How do web crawlers work?", a: "Web crawlers automatically scrape URLs you provide to build a custom knowledge base. They respect robots.txt and re-crawl your site every 24 hours to keep the AI updated." },
    ]
  }
];

const AgentFAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-[#1f88d9] mb-6">
          <MessageCircleQuestion size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">How can we help?</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Browse through our frequently asked questions or use the search bar below to find exactly what you're looking for.</p>
        
        <div className="max-w-xl mx-auto relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-base shadow-sm focus:outline-none focus:border-[#1f88d9] focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-10">
        {dummyFaqs.map((section, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 pl-2 border-l-4 border-[#1f88d9]">{section.category}</h2>
            
            <div className="space-y-3">
              {section.questions.map((faq, qIdx) => {
                const isOpen = openItems[`${catIdx}-${qIdx}`];
                
                // Very basic client-side search filter
                if (searchTerm && !faq.q.toLowerCase().includes(searchTerm.toLowerCase()) && !faq.a.toLowerCase().includes(searchTerm.toLowerCase())) {
                  return null;
                }

                return (
                  <div 
                    key={qIdx} 
                    className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden ${
                      isOpen ? 'border-[#1f88d9] shadow-md shadow-blue-500/10' : 'border-gray-100 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <button 
                      className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                      onClick={() => toggleItem(catIdx, qIdx)}
                    >
                      <span className={`font-semibold text-sm sm:text-base pr-8 ${isOpen ? 'text-[#1f88d9]' : 'text-slate-800'}`}>
                        {faq.q}
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1f88d9]' : 'text-gray-400'}`} 
                      />
                    </button>
                    
                    <div 
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Contact */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-[#f4f7fb] rounded-3xl p-8 text-center border border-blue-100">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Still have questions?</h3>
        <p className="text-gray-500 text-sm mb-6">If you couldn't find the answer to your question, our support team is ready to help.</p>
        <button className="bg-[#1f88d9] hover:bg-[#1a7bc4] text-white px-8 py-3 rounded-xl font-semibold shadow-sm transition-colors inline-flex items-center gap-2">
          Contact Support
        </button>
      </div>

    </div>
  );
};

export default AgentFAQ;
