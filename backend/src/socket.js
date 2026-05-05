const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");
const messageModel = require("./models/message.model");
const chatModel = require("./models/chats.model");
const ticketModel = require("./models/ticket.model");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
      ].filter(Boolean),
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
      
      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.user;
    const orgRoom = `org_${user.organizationId}`;
    console.log(`[Socket] User connected: ${user.name} (${user.role}) - ${socket.id}`);

    // Join organization-wide room for presence updates
    socket.join(orgRoom);

    // Update user status to online
    const now = new Date();
    const updateData = { 
      isOnline: true, 
      lastSeen: now 
    };

    // If it's an agent and they were offline, make them available
    if (user.role === "agent" && user.status === "Offline") {
      updateData.status = "Available";
    } else if (user.role === "customer") {
      updateData.status = "Available";
    }

    await userModel.findByIdAndUpdate(user._id, updateData);

    // Notify organization members about status change
    io.to(orgRoom).emit("status_update", { 
      userId: user._id, 
      isOnline: true,
      status: updateData.status || user.status,
      lastSeen: now
    });

    // If it's an agent, send them the list of currently online users in their org
    if (user.role === "agent" || user.role === "admin") {
      const onlineOrgUsers = await userModel.find({ 
        organizationId: user.organizationId, 
        isOnline: true 
      }).select("_id isOnline status lastSeen");
      
      socket.emit("initial_presence", onlineOrgUsers.map(u => ({
        userId: u._id,
        isOnline: u.isOnline,
        status: u.status,
        lastSeen: u.lastSeen
      })));
    }

    // Join room based on chatId
    socket.on("join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`[Socket] User ${user.name} joined room: chat_${chatId}`);
    });

    // Handle incoming messages
    socket.on("send_message", async (data) => {
      try {
        const { chatId, message, senderRole } = data;

        // Security check: ensure user belongs to the chat's organization
        const chat = await chatModel.findById(chatId);
        if (!chat || chat.organizationId.toString() !== user.organizationId.toString()) {
          return socket.emit("error", { message: "Unauthorized chat access" });
        }

        // Find associated ticket to get ticketId and receiverId
        const ticket = await ticketModel.findOne({ chatId: chatId });
        
        let receiverId = null;
        if (user.role === "customer") {
          receiverId = ticket?.assignedTo || null;
        } else {
          receiverId = chat.userId;
        }

        // Save message to DB
        const newMessage = await messageModel.create({
          chatId,
          ticketId: ticket?._id || null,
          sender: senderRole || user.role,
          content: message,
          senderId: user._id,
          receiverId,
          organizationId: user.organizationId
        });

        // Broadcast to the room
        io.to(`chat_${chatId}`).emit("receive_message", {
          ...newMessage.toObject(),
          senderName: user.name,
          createdAt: newMessage.createdAt
        });

        // Update last seen on every message
        await userModel.findByIdAndUpdate(user._id, { lastSeen: new Date() });

      } catch (err) {
        console.error("[Socket] Error sending message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicators
    socket.on("typing_start", (chatId) => {
      socket.to(`chat_${chatId}`).emit("user_typing", { 
        userId: user._id, 
        userName: user.name,
        isTyping: true 
      });
    });

    socket.on("typing_stop", (chatId) => {
      socket.to(`chat_${chatId}`).emit("user_typing", { 
        userId: user._id, 
        isTyping: false 
      });
    });

    socket.on("disconnect", async () => {
      console.log(`[Socket] User disconnected: ${user.name} - ${socket.id}`);
      
      const disconnectTime = new Date();
      // Update user status to offline
      await userModel.findByIdAndUpdate(user._id, { 
        isOnline: false, 
        status: "Offline",
        lastSeen: disconnectTime 
      });

      // Notify organization members
      io.to(orgRoom).emit("status_update", { 
        userId: user._id, 
        isOnline: false,
        status: "Offline",
        lastSeen: disconnectTime
      });
    });
  });

  return io;
};

module.exports = initSocket;
