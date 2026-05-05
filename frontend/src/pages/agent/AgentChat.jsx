import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Send,
  MoreVertical,
  Search,
  Paperclip,
  CheckCheck,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/common/Loader.jsx";
import { useSearch } from "../../context/SearchContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import typingGif from "../../assets/gif/Loading Dots Blue.gif";
import toast from "react-hot-toast";

const AgentChat = () => {
  const { searchTerm: globalSearchTerm } = useSearch();
  const { socket, onlineUsers } = useSocket();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeChat, setActiveChat] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [inputMsg, setInputMsg] = useState("");
  const [remoteTyping, setRemoteTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleChatClick = async (chat) => {
    setActiveChat(chat);
    setActiveChatId(chat._id);
    if (socket) {
      socket.emit("join_chat", chat._id);
    }
    try {
      const { data } = await axiosClient.get(`/chat/getChatById/${chat._id}`);
      setActiveChatMessages(data.data || []);
      
      // Fetch associated ticket
      const ticketRes = await axiosClient.get("/tickets/getAllTickets");
      const tickets = ticketRes.data.tickets || ticketRes.data.data || [];
      const currentTicket = tickets.find(t => t.chatId === chat._id || t.chatId?._id === chat._id);
      setActiveTicket(currentTicket);
    } catch (err) {
      console.error("Failed to fetch chat details:", err);
    }
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/chat/getAllChats");
      const fetchedChats = data.data || [];
      setChats(fetchedChats);

      const routedChatId = location.state?.chatId;
      if (routedChatId) {
        const chatToSelect = fetchedChats.find((c) => c._id === routedChatId);
        if (chatToSelect) {
          handleChatClick(chatToSelect);
        }
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Socket setup for receiving messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      const msgChatId = msg.chatId?._id || msg.chatId;
      if (String(msgChatId) === String(activeChatId)) {
        setActiveChatMessages((prev) => {
          // Avoid duplicates
          const msgId = msg._id || msg.id;
          if (prev.find((m) => (m._id || m.id) === msgId)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    socket.on("user_typing", (data) => {
      if (String(data.chatId || activeChatId) === String(activeChatId)) {
        setRemoteTyping(data.isTyping);
      }
    });

    socket.on("ticket_updated", () => fetchChats());
    socket.on("ticket_reviewed", () => fetchChats());

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_typing");
      socket.off("ticket_updated");
      socket.off("ticket_reviewed");
    };
  }, [socket, activeChatId]);

  // Data Fetching
  useEffect(() => {
    fetchChats();
  }, [location.state?.chatId]);

  useEffect(() => {
    if (!socket || !activeChatId || !inputMsg.trim()) return;

    socket.emit("typing_start", activeChatId);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", activeChatId);
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [inputMsg, socket, activeChatId]);

  useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeChatId) return;

    const messageText = inputMsg;
    setInputMsg("");

    // Optimistic UI could be added here, but we'll wait for the server response/socket emit
    try {
      await axiosClient.post(`/chat/sendMsg/${activeChatId}`, {
        message: messageText,
        sender: "agent",
      });
      // The message will be received via socket.on("receive_message")
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleResolveTicket = async () => {
    if (!activeTicket) return;
    try {
      await axiosClient.put(`/tickets/ticketStatusUpdate/${activeTicket._id}`, { status: "waiting-for-review" });
      setActiveTicket({ ...activeTicket, status: "waiting-for-review" });
      
      // Notify customer via chat
      await axiosClient.post(`/chat/sendMsg/${activeChatId}`, {
        message: "System: The agent has marked this ticket as resolved. Please provide your feedback to close the ticket.",
        sender: "agent"
      });
      toast.success("Ticket marked as waiting for review.");
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const q = searchTerm.toLowerCase();
    const customerName = (chat.userId?.name || "").toLowerCase();
    const idMatch = chat._id?.toLowerCase().includes(q);
    const nameMatch = customerName.includes(q);
    const statusMatch = chat.status?.toLowerCase().includes(q);
    return idMatch || nameMatch || statusMatch;
  });

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatLastSeen = (dateStr) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "yesterday";
    return `${diffDays} days ago`;
  };

  const getUserPresence = (userId) => {
    if (!userId) return { isOnline: false, lastSeen: null };
    const presence = onlineUsers.get(String(userId));
    if (!presence) return { isOnline: false, lastSeen: null };
    return presence;
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-fade-in-up">
      <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm flex-1 flex overflow-hidden max-h-[80vh]">
        {/* Chat Sidebar */}
        <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-[#1f88d9] focus:ring-1 focus:ring-[#1f88d9] rounded-xl text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
            {loading && chats.length === 0 ? (
              <p className="text-center text-gray-500 mt-4 text-sm">
                Loading chats...
              </p>
            ) : filteredChats.length === 0 ? (
              <p className="text-center text-gray-500 mt-4 text-sm">
                No chats found.
              </p>
            ) : (
              filteredChats.map((chat) => {
                const presence = getUserPresence(chat.userId?._id);
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleChatClick(chat)}
                    className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-colors ${
                      activeChatId === chat._id
                        ? "bg-blue-50 border border-blue-100"
                        : "hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                          activeChatId === chat._id
                            ? "bg-[#1f88d9] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {getInitials(chat.userId?.name)}
                      </div>
                      {presence.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="text-sm font-semibold text-slate-800 truncate">
                          {chat.userId?.name || `Chat ${chat._id.substring(chat._id.length - 4)}`}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${presence.isOnline ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <p className="text-[11px] text-gray-500 truncate">
                          {presence.isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-24 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#1f88d9] flex items-center justify-center font-bold text-white text-sm">
                      {getInitials(activeChat.userId?.name)}
                    </div>
                    {getUserPresence(activeChat.userId?._id).isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {activeChat.userId?.name || `Chat ${activeChat._id.substring(activeChat._id.length - 4)}`}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getUserPresence(activeChat.userId?._id).isOnline ? (
                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Online
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-medium">
                          Offline • Last seen {formatLastSeen(getUserPresence(activeChat.userId?._id).lastSeen || activeChat.userId?.lastSeen)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   {activeTicket && activeTicket.status !== "resolved" && activeTicket.status !== "closed" && activeTicket.status !== "waiting-for-review" && (
                     <button 
                       onClick={handleResolveTicket}
                       className="px-4 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-full hover:bg-green-100 transition-colors"
                     >
                       Mark as Resolved
                     </button>
                   )}
                   {activeTicket && activeTicket.status === "waiting-for-review" && (
                     <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100">
                       Awaiting Review
                     </span>
                   )}
                   <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-hide">
                {activeChatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs">Start the conversation below</p>
                  </div>
                ) : (
                  activeChatMessages.map((msg) => {
                    const isAgent = msg.sender === "agent";
                    return (
                      <div
                        key={msg._id || msg.id || Math.random()}
                        className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                            isAgent
                              ? "bg-[#1f88d9] text-white rounded-tr-sm"
                              : "bg-white border border-gray-100 text-slate-800 shadow-sm rounded-tl-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 px-1">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(
                              msg.createdAt || Date.now(),
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isAgent && (
                            <CheckCheck size={14} className="text-[#1f88d9]" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                
                {remoteTyping && (
                  <div className="flex flex-col items-start animate-fade-in">
                    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Customer is typing</span>
                        <img src={typingGif} alt="Typing..." className="h-4 w-auto object-contain" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3"
                >
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-[#1f88d9] transition-colors rounded-full hover:bg-blue-50"
                  >
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
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-[#1f88d9] mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Select a Conversation</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Pick a customer from the list to view their history and start chatting in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
