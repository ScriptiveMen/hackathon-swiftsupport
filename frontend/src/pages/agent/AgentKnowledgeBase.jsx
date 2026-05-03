import React from 'react';

const AgentKnowledgeBase = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Knowledge Base</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Category {i}</h3>
              <p className="text-gray-500 text-sm">Articles and guides related to topic {i}.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentKnowledgeBase;
