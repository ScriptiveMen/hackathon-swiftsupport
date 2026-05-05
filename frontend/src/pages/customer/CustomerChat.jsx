import { useState, useEffect, useRef } from "react";
import {
  Headset,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Smile,
  Star,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/common/Loader.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import typingGif from "../../assets/gif/Loading Dots Blue.gif";
import toast from "react-hot-toast";

const FeedbackModal = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hover, setHover] = useState(0);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-center animate-fade-in">
      <div className="max-w-sm w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          How was your experience?
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Your feedback helps us improve our service.
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                size={32}
                className={`${
                  (hover || rating) >= star
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                } transition-colors`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional: Tell us more about it..."
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm mb-6 focus:outline-none focus:border-blue-400 transition-all resize-none h-24"
        />

        <button
          onClick={() => onSubmit(rating, feedback)}
          disabled={!rating}
          className="w-full py-4 bg-blue-500 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

const CustomerChat = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { socket } = useSocket();
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [inputMsg, setInputMsg] = useState("");
  const [remoteTyping, setRemoteTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [escalating, setEscalating] = useState(false);
  const scrollRef = useRef(null);

  const user = JSON.parse(
    localStorage.getItem("user") || '{"name": "Customer"}',
  );

  // Socket setup
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      const msgChatId = msg.chatId?._id || msg.chatId;
      if (String(msgChatId) === String(activeChatId)) {
        setActiveChatMessages((prev) => {
          // Check if message already exists (deduplication)
          if (prev.some((m) => (m._id || m.id) === (msg._id || msg.id))) return prev;
          return [...prev, msg];
        });

        // If message starts with "System: The agent has marked this ticket as resolved"
        if (msg.content?.includes("marked this ticket as resolved")) {
          fetchTicketStatus();
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    socket.on("user_typing", (data) => {
      if (String(activeChatId) === String(data.chatId || activeChatId)) {
        setRemoteTyping(data.isTyping);
      }
    });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_typing");
    };
  }, [socket, activeChatId]);

  const fetchTicketStatus = async (cid) => {
    try {
      const { data } = await axiosClient.get("/tickets/getAllTickets");
      const tickets = data.data || [];
      const currentTicket = tickets.find(
        (t) =>
          t.chatId === (cid || activeChatId) ||
          t.chatId?._id === (cid || activeChatId),
      );
      if (currentTicket) {
        setActiveTicket(currentTicket);
        if (currentTicket.status === "waiting-for-review") {
          setShowFeedback(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch ticket status:", err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChatMessages, aiLoading]);

  // Data Fetching
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
    if (!socket) return;

    const initChat = async () => {
      try {
        setChatLoading(true);
        const newChat = await axiosClient.post(`${baseUrl}/api/chat/startChat`);
        const cid = newChat.data.chatId;
        console.log("[CustomerChat] Started chat:", cid);
        setActiveChatId(cid);
        socket.emit("join_chat", cid);
        // Fetch the welcome message
        const { data } = await axiosClient.get(`${baseUrl}/api/chat/getChatById/${cid}`);
        setActiveChatMessages(data.data || []);
        fetchTicketStatus(cid);
      } catch (err) {
        console.error("Failed to start new chat:", err);
      } finally {
        setChatLoading(false);
      }
    };
    
    if (!activeChatId) {
      initChat();
    } else {
      socket.emit("join_chat", activeChatId);
    }
  }, [socket, activeChatId]); 

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeChatId) return;

    const messageText = inputMsg;
    setInputMsg("");

    // Optimistic UI update
    const tempId = Date.now().toString();
    const optimisticMsg = {
      _id: tempId,
      chatId: activeChatId,
      sender: "user",
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setActiveChatMessages((prev) => [...prev, optimisticMsg]);

    try {
      setAiLoading(true);
      await axiosClient.post(`${baseUrl}/api/ai/respond`, {
        question: messageText,
        chatId: activeChatId,
      });
      // The real message will be received via socket.on("receive_message")
      // We don't necessarily need to replace the optimistic one here if the socket works,
      // but let's at least keep it until the real one arrives.
    } catch (err) {
      console.error("Failed to send message:", err);
      setActiveChatMessages(prev => prev.filter(m => m._id !== tempId));
      toast.error("Failed to send message");
    } finally {
      setAiLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!activeChatId) return;
    setEscalating(true);
    try {
      const { data: ticketData } = await axiosClient.post(
        "/tickets/createTicket",
        {
          title: "Chat Escalation",
          description: `Customer ${user.name || "User"} requested human assistance.`,
          chatId: activeChatId,
          priority: "high",
          status: "open",
        },
      );

      const ticket = ticketData.data || ticketData;
      setActiveTicket(ticket);

      // If it's a new ticket, assignment logic might have run on backend
      // Just refresh ticket status
      fetchTicketStatus(activeChatId);
    } catch (err) {
      console.error("Escalation failed:", err);
    } finally {
      setEscalating(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleFeedbackSubmit = async (rating, comment) => {
    if (!activeTicket) return;
    try {
      await axiosClient.post("/tickets/submitFeedback", {
        ticketId: activeTicket._id,
        rating,
        feedback: comment,
      });
      setShowFeedback(false);
      fetchTicketStatus();
      toast.success(
        rating > 3
          ? "Thank you for your feedback!"
          : "We've received your feedback. An agent will follow up if needed.",
      );
    } catch (err) {
      console.error("Feedback submission failed:", err);
    }
  };

  return (
    <>
      {chatLoading && <Loader />}
      <div className="flex flex-col h-[calc(100vh-120px)] mt-[100px] max-w-4xl mx-auto px-4 font-[Inter,sans-serif] overflow-hidden">
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex-1 flex flex-col overflow-hidden relative min-h-0 mb-4">
          {showFeedback && <FeedbackModal onSubmit={handleFeedbackSubmit} />}

          {/* Chat Header */}
          <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#04b8ff] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22c55e] border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#111827] leading-tight">
                  SwiftSupport Assistant
                </h3>
                <p className="text-[11px] font-bold text-[#22c55e] mt-0.5 tracking-wider uppercase">
                  {activeTicket?.status === "in-progress"
                    ? "● Agent Connected"
                    : "● Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!activeTicket && (
                <button
                  onClick={handleEscalate}
                  disabled={escalating}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <Headset size={16} />
                  {escalating ? "Connecting..." : "Connect to Human"}
                </button>
              )}

              {activeTicket &&
                activeTicket.status === "needs-human-attention" && (
                  <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                    Human Help Requested
                  </span>
                )}

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
                <p className="text-sm font-medium">
                  Starting a new conversation...
                </p>
              </div>
            )}

            {activeChatMessages.map((msg, idx) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg._id || idx}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-6 py-4 rounded-[20px] text-[15px] leading-snug ${
                      isUser
                        ? "bg-[#04b8ff] text-white rounded-tr-none shadow-md shadow-blue-100"
                        : "bg-[#f9fafb] border border-gray-100 text-[#374151] rounded-tl-none"
                    }`}
                  >
                    {msg.content || msg.message || msg.text}
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 mt-2 px-1 uppercase tracking-tight">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              );
            })}

            {/* Resolved Message Overlay */}
            {(activeTicket?.status === "resolved" ||
              activeTicket?.status === "closed") && (
              <div className="flex justify-center my-8 animate-in zoom-in duration-500">
                <div className="bg-green-50 border border-green-100 p-6 rounded-[2rem] text-center max-w-md shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headset className="text-green-600" size={24} />
                  </div>
                  <h4 className="text-green-800 font-bold text-lg mb-1">
                    Issue Resolved!
                  </h4>
                  <p className="text-green-700/80 text-sm">
                    Your issue has been resolved successfully. <br />
                    Thank you for contacting support.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        await axiosClient.put(
                          `/tickets/reopenTicket/${activeTicket._id}`,
                        );
                        toast.success(
                          "Ticket reopened. Connecting you back...",
                        );
                        // Refresh ticket status
                        const { data } = await axiosClient.get(
                          `/tickets/getTicketById/${activeTicket._id}`,
                        );
                        setActiveTicket(data.data);
                      } catch (err) {
                        toast.error("Failed to reopen ticket.");
                      }
                    }}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100"
                  >
                    Reopen Issue
                  </button>
                </div>
              </div>
            )}

            {(aiLoading || chatLoading || remoteTyping) && (
              <div className="flex flex-col items-start">
                <div className="bg-[#f9fafb] border border-gray-100 rounded-[20px] rounded-tl-none px-5 py-4">
                  <div className="flex items-center gap-3">
                    {remoteTyping && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        Agent is typing
                      </span>
                    )}
                    <img
                      src={typingGif}
                      alt="Typing..."
                      className="h-4 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-8 pb-8 pt-4 bg-white border-t border-gray-50">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-4"
            >
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
                  disabled={aiLoading || showFeedback}
                  className="w-full bg-[#f9fafb] border border-transparent px-6 py-4 rounded-full text-[15px] text-[#111827] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-200 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  className="absolute right-5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Smile size={24} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputMsg.trim() || aiLoading || showFeedback}
                className="w-14 h-14 bg-[#04b8ff] hover:bg-[#0090cc] text-white rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-300 tracking-[0.05em] uppercase">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
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
