import React, { useState, useEffect } from "react";
import { ChevronDown, Search, MessageCircleQuestion } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/common/Loader.jsx";

const AgentFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState({});

  // Data Fetching
  useEffect(() => {
    const getFaqs = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get("/knowledge/faq");
        setFaqs(data.data || data.faqs || data);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    getFaqs();
  }, []);


  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Group flat faqs array by category
  const grouped = (faqs || []).reduce((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const sections = Object.entries(grouped).map(([category, questions]) => ({
    category,
    questions,
  }));

  // Filter by search
  const filteredSections = sections
    .map((section) => ({
      ...section,
      questions: section.questions.filter((faq) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          (faq.question?.toLowerCase() || "").includes(term) ||
          (faq.answer?.toLowerCase() || "").includes(term)
        );
      }),
    }))
    .filter((section) => section.questions.length > 0);

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
        {loading ? (
          <div className="text-center text-gray-400 py-16 text-base">Loading FAQs...</div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-base">
            {searchTerm ? "No results found. Try a different search." : "No FAQs available yet."}
          </div>
        ) : filteredSections.map((section, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 pl-2 border-l-4 border-[#1f88d9]">{section.category}</h2>

            <div className="space-y-3">
              {section.questions.map((faq) => {
                const isOpen = openItems[faq._id];
                return (
                  <div
                    key={faq._id}
                    className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden ${
                      isOpen ? "border-[#1f88d9] shadow-md shadow-blue-500/10" : "border-gray-100 hover:border-gray-200 shadow-sm"
                    }`}
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                      onClick={() => toggleItem(faq._id)}
                    >
                      <span className={`font-semibold text-sm sm:text-base pr-8 ${isOpen ? "text-[#1f88d9]" : "text-slate-800"}`}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#1f88d9]" : "text-gray-400"}`}
                      />
                    </button>

                    <div
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                        {faq.answer || "No answer provided yet."}
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
