const express = require("express");
const router = express.Router();

const { getAllChats, getChatById, startChat, sendMessage } = require("../controllers/chat.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

// Get all chats for the authenticated user
router.get("/getAllChats", authMiddleware, getAllChats);

// Get chat by ID
router.get("/getChatById/:id", authMiddleware, getChatById);

// Start a new chat
router.post("/startChat", authMiddleware, startChat);

// Send message
router.post("/sendMsg/:chatId", authMiddleware, sendMessage);

module.exports = router;