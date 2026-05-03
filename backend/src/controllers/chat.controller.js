const userModel = require("../models/user.model");
const organizationModel = require("../models/organization.model");
const chatModel = require("../models/chats.model");
const knowledgeBaseModel = require("../models/knowledge.model");
const messageModel = require("../models/message.model");
const ticketModel = require("../models/ticket.model");
const aiService = require("../service/ai.service");

const getAllChats = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;

    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const chats = await chatModel
      .find({ userId: userId, organizationId: organizationId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error fetching chats: ${error.message}`,
    });
  }
};

const getChatById = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;
    const chatId = req.params.id;

    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ status: false, message: "Chat not found" });
    }

    // check for organization access and role-based access
    if (chat.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access to this chat" });
    }

    if (user.role === "customer") {
      if (chat.userId.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ status: false, message: "Unauthorized access to this chat" });
      } //else if (user.role === "agent" || user.role === "admin") {
      //     // Allowed – no further checks needed agent and admin
      // } else {
      //     return res.status(403).json({ status: false, message: "Unauthorized access to this chat" });
      // }
    }

    // fetch all messages for the chat
    const messages = await messageModel
      .find({ chatId: chatId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      status: true,
      message: "Chat fetched successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error fetching chat: ${error.message}`,
    });
  }
};

const startChat = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;

    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const chat = await chatModel.create({
      userId,
      organizationId,
      status: "active",
    });

    res.status(201).json({
      success: true,
      chatId: chat._id,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error starting chat: ${error.message}`,
    });
  }
};

module.exports = {
  getAllChats,
  getChatById,
  startChat,

};
