const express = require("express");
const router = express.Router();

const { getAllChats, getChatById, startChat } = require("../controllers/chat.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

// Get all chats for the authenticated user
router.get("/getAllChats", authMiddleware, getAllChats);

// Get chat by ID
router.get("/getChatById/:id", authMiddleware, getChatById);

// Start a new chat
router.post("/startChat", authMiddleware, startChat);

// // Chat message
// router.post("/chatMessage", authMiddleware, chatMessage);

module.exports = router;