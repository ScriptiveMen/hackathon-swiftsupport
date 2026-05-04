import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Send, MoreVertical, Search, Paperclip, CheckCheck } from "lucide-react";
import { getAllChats, getChatById } from "../../store/slices/chatSlice";

const AgentChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { chats, activeChatMessages, activeChatId, loading } = useSelector((state) => state.chat);
  
  const [activeChat, setActiveChat] = useState(null);
  const [inputMsg, setInputMsg] = useState("");

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    dispatch(getChatById(chat._id));
  };

  useEffect(() => {
    dispatch(getAllChats()).unwrap().then((fetchedChats) => {
      const routedChatId = location.state?.chatId;
      if (routedChatId) {
        const chatToSelect = fetchedChats.find(c => c._id === routedChatId);
        if (chatToSelect) {
          handleChatClick(chatToSelect);
        }
      }
    }).catch(console.error);
  }, [dispatch, location.state]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    // TODO: implement sending message via backend API (chat/sendMsg endpoint not defined in backend yet)
    // For now, we just clear the input to show UI response.
    setInputMsg("");
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-fade-in-up">
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm flex-1 flex overflow-hidden max-h-[80vh]">
        
        {/* Chat Sidebar */}
        <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-[#1f88d9] focus:ring-1 focus:ring-[#1f88d9] rounded-xl text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
            {loading && chats.length === 0 ? (
              <p className="text-center text-gray-500 mt-4 text-sm">Loading chats...</p>
            ) : chats.length === 0 ? (
              <p className="text-center text-gray-500 mt-4 text-sm">No chats available.</p>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-colors ${
                    activeChatId === chat._id 
                    ? 'bg-blue-50 border border-blue-100' 
                    : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      activeChatId === chat._id ? 'bg-[#1f88d9] text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {chat.userId ? chat.userId.substring(0, 1).toUpperCase() : 'U'}
                    </div>
                    {chat.status === 'active' && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">Chat {chat._id.substring(chat._id.length - 4)}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate capitalize">{chat.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-20 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#1f88d9] flex items-center justify-center font-bold text-white">
                        {activeChat.userId ? activeChat.userId.substring(0, 1).toUpperCase() : 'U'}
                      </div>
                      {activeChat.status === 'active' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Chat {activeChat._id.substring(activeChat._id.length - 4)}</h3>
                      <p className="text-xs text-gray-500 font-medium capitalize">{activeChat.status}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-hide">
                {activeChatMessages.length === 0 ? (
                  <p className="text-center text-gray-400 mt-10 text-sm">No messages yet.</p>
                ) : (
                  activeChatMessages.map((msg) => {
                    const isAgent = msg.sender === "agent";
                    return (
                      <div key={msg._id || msg.id} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                          isAgent 
                          ? 'bg-[#1f88d9] text-white rounded-tr-sm' 
                          : 'bg-white border border-gray-100 text-slate-800 shadow-sm rounded-tl-sm'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text || msg.message}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 px-1">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAgent && <CheckCheck size={14} className="text-[#1f88d9]" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <button type="button" className="p-2 text-gray-400 hover:text-[#1f88d9] transition-colors rounded-full hover:bg-blue-50">
                    <Paperclip size={20} />
                  </button>
                  
                  <input 
                    type="text" 
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-gray-50 border border-gray-100 px-4 py-3 rounded-full text-sm focus:outline-none focus:border-[#1f88d9] focus:ring-1 focus:ring-[#1f88d9] transition-all"
                  />
                  
                  <button 
                    type="submit" 
                    disabled={!inputMsg.trim()}
                    className="w-11 h-11 bg-[#1f88d9] hover:bg-[#1a7bc4] text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20"
                  >
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50/30">
              <p className="text-gray-400 text-sm font-medium">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
