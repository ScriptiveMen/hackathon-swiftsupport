import { useState, useEffect, useRef } from "react";
import { Headset, MessageSquare, MoreHorizontal, Paperclip, Smile } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/common/Loader.jsx";

const CustomerChat = () => {
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [inputMsg, setInputMsg] = useState("");
  const [escalating, setEscalating] = useState(false);
  const scrollRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || '{"name": "Customer"}');

  // Data Fetching
  useEffect(() => {
    const initChat = async () => {
      try {
        setChatLoading(true);
        const { data } = await axiosClient.get("/chat/getAllChats");
        const fetchedChats = data.data || [];
        if (fetchedChats.length > 0) {
          const cid = fetchedChats[0]._id;
          setActiveChatId(cid);
          const chatDetails = await axiosClient.get(`/chat/getChatById/${cid}`);
          setActiveChatMessages(chatDetails.data.data || []);
        } else {
          const newChat = await axiosClient.post("/chat/startChat");
          setActiveChatId(newChat.data.chatId);
          setActiveChatMessages([]);
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setChatLoading(false);
      }
    };
    initChat();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeChatId) return;

    const messageText = inputMsg;
    setInputMsg("");
    
    try {
      const { data: msgData } = await axiosClient.post(`/chat/sendMsg/${activeChatId}`, { message: messageText, sender: "user" });
      setActiveChatMessages(prev => [...prev, msgData.data]);
      
      setAiLoading(true);
      const { data: aiData } = await axiosClient.post("/ai/respond", { question: messageText, chatId: activeChatId });
      if (aiData.answer) {
        setActiveChatMessages(prev => [...prev, { message: aiData.answer, sender: "agent", createdAt: new Date() }]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!activeChatId) return;
    setEscalating(true);
    try {
      const { data: ticketData } = await axiosClient.post("/tickets/createTicket", {
        title: "Chat Escalation",
        description: `Customer ${user.name || 'User'} requested human assistance.`,
        chatId: activeChatId,
        priority: "high",
        status: "open"
      });
      const ticket = ticketData.ticket || ticketData;

      const { data: agentsData } = await axiosClient.get("/auth/agents");
      const agents = agentsData.agents || agentsData.data || agentsData;
      
      if (agents && agents.length > 0) {
        const autoAgentId = agents[0]._id || agents[0].id;
        await axiosClient.put(`/tickets/ticketAssginedToAgent/${ticket._id}`, { agentId: autoAgentId });
        
        const { data: notifyData } = await axiosClient.post(`/chat/sendMsg/${activeChatId}`, { 
          message: `System: An agent (${agents[0].name || 'Support'}) has been automatically assigned to this chat. They will join shortly. AI will continue to assist you in the meantime.`, 
          sender: "agent" 
        });
        setActiveChatMessages(prev => [...prev, notifyData.data]);
      } else {
        const { data: notifyData } = await axiosClient.post(`/chat/sendMsg/${activeChatId}`, { 
          message: "I've notified our support team. They will join as soon as someone is available. AI will continue to assist you.", 
          sender: "agent" 
        });
        setActiveChatMessages(prev => [...prev, notifyData.data]);
      }
    } catch (err) {
      console.error("Escalation failed:", err);
    } finally {
      setEscalating(false);
    }
  };





  return (
    <>
      {chatLoading && <Loader />}
      <div className="flex flex-col h-[calc(100vh-80px)] mt-[80px] max-w-4xl mx-auto p-4 md:py-6 font-[Inter,sans-serif]">
      <div className="bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex-1 flex flex-col overflow-hidden relative min-h-0">
        
        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#04b8ff] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22c55e] border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#111827] leading-tight">SwiftSupport Assistant</h3>
              <p className="text-[11px] font-bold text-[#22c55e] mt-0.5 tracking-wider uppercase">● Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleEscalate}
              disabled={escalating}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Headset size={16} />
              {escalating ? "Connecting..." : "Connect to Human"}
            </button>

            <button className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar"
        >
          {activeChatMessages.length === 0 && !chatLoading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
               <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <MessageSquare size={32} />
               </div>
               <p className="text-sm font-medium">Starting a new conversation...</p>
            </div>
          )}

          {activeChatMessages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div key={msg._id || idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-6 py-4 rounded-[20px] text-[15px] leading-snug ${
                  isUser 
                  ? 'bg-[#04b8ff] text-white rounded-tr-none shadow-md shadow-blue-100' 
                  : 'bg-[#f9fafb] border border-gray-100 text-[#374151] rounded-tl-none'
                }`}>
                  {msg.text || msg.message}
                </div>
                <span className="text-[11px] font-bold text-gray-300 mt-2 px-1 uppercase tracking-tight">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </span>
              </div>
            );
          })}
          
          {(aiLoading || chatLoading) && (
            <div className="flex flex-col items-start">
              <div className="bg-[#f9fafb] border border-gray-100 rounded-[20px] rounded-tl-none px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-8 pb-8 pt-4 bg-white border-t border-gray-50">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <button 
              type="button" 
              className="p-2 text-gray-400 hover:text-[#04b8ff] transition-colors"
            >
              <Paperclip size={24} />
            </button>
            
            <div className="flex-1 relative flex items-center">
              <input 
                type="text" 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type your message here..."
                disabled={aiLoading}
                className="w-full bg-[#f9fafb] border border-transparent px-6 py-4 rounded-full text-[15px] text-[#111827] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-200 transition-all disabled:opacity-50"
              />
              <button type="button" className="absolute right-5 text-gray-400 hover:text-gray-600 transition-colors">
                <Smile size={24} />
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={!inputMsg.trim() || aiLoading}
              className="w-14 h-14 bg-[#04b8ff] hover:bg-[#0090cc] text-white rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-300 tracking-[0.05em] uppercase">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              End-to-end encrypted
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
            <p className="text-[10px] font-bold text-gray-300 tracking-[0.05em] uppercase">
              Powered by SwiftSupport AI
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CustomerChat;
