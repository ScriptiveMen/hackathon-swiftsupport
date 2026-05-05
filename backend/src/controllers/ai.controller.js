const userModel = require("../models/user.model");
const organizationModel = require("../models/organization.model");
const chatModel = require("../models/chats.model");
const knowledgeBaseModel = require("../models/knowledge.model");
const messageModel = require("../models/message.model");
const ticketModel = require("../models/ticket.model");
const aiService = require("../service/ai.service");

async function aiResponse(req, res) {
  try {
    const { userId, organizationId, role } = req.user;
    let { question, chatId } = req.body;

    if (!question) {
      return res.status(400).json({ status: false, message: "Question is required" });
    }

    const io = req.app.get("socketio");

    // Helper to save and emit messages
    const saveUserMessage = async (cid) => {
      const msg = await messageModel.create({ chatId: cid, sender: "user", content: question });
      if (io) io.to(`chat_${String(cid)}`).emit("receive_message", msg.toObject());
      return msg;
    };
    const saveAiMessage = async (cid, reply) => {
      const msg = await messageModel.create({ chatId: cid, sender: "ai", content: reply });
      if (io) io.to(`chat_${String(cid)}`).emit("receive_message", msg.toObject());
      return msg;
    };

    // If chatId provided, validate it
    let chat = null;
    let ticket = null;
    if (chatId) {
      chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ status: false, message: "Chat not found" });
      }
      ticket = await ticketModel.findOne({ chatId });

      // If agent assigned and customer is talking → no AI, just save/emit message
      if (ticket && ticket.assignedTo && role === "customer") {
        await saveUserMessage(chatId);
        return res.status(200).json({
          status: true,
          answer: "Your message has been sent to the agent. They'll reply soon.",
          agentAssigned: true,
        });
      }
    }

    // Fetch knowledge base
    const knowledgeBaseEntries = await knowledgeBaseModel
      .find({ organizationId })
      .select("-_id question answer tags");
    const kbText = knowledgeBaseEntries
      .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
      .join("\n\n");
    const userPrompt = `${kbText}\n\nCustomer Question: ${question}`;

    // Generate AI response
    let aiReply = await aiService.generateResponse(userPrompt, "");
    if (!aiReply) {
      return res.status(500).json({ status: false, message: "AI service failed" });
    }

    // CASE: AI wants to create a ticket
    if (aiReply.startsWith("CREATE_TICKET:")) {
      let targetChatId = chatId;
      if (!targetChatId) {
        const newChat = await chatModel.create({ organizationId, userId, status: "active" });
        targetChatId = newChat._id;
      }

      await saveUserMessage(targetChatId);

      const ticketSummary = aiReply.replace("CREATE_TICKET:", "").trim();
      const match = ticketSummary.match(/title:\s*(.*?),\s*description:\s*(.*?),\s*priority:\s*(.*?),\s*status:\s*(.*?)(?:\.|$)/i);
      let title = "Support needed", description = question, priority = "medium", status = "open";
      if (match) {
        title = match[1].trim() || title;
        description = match[2].trim() || question;
        if (["low","medium","high","urgent"].includes(match[3].trim().toLowerCase())) priority = match[3].trim().toLowerCase();
        let rawStatus = match[4].trim().toLowerCase().replace(/\.$/, "");
        if (["open","in-progress","resolved","closed"].includes(rawStatus)) status = rawStatus;
      }

      const newTicket = await ticketModel.create({
        userId,
        organizationId,
        chatId: targetChatId,
        title,
        description,
        status,
        priority,
        assignedTo: null,
      });

      const ticketMessage = `I've created a ticket (#${newTicket._id}) for you. An agent will respond soon.`;
      await saveAiMessage(targetChatId, ticketMessage);

      return res.status(200).json({
        status: true,
        answer: ticketMessage,
        ticketId: newTicket._id,
        chatId: targetChatId,
      });
    }

    // CASE: Normal AI answer
    let targetChatId = chatId;
    if (!targetChatId) {
      const newChat = await chatModel.create({ organizationId, userId, status: "active" });
      targetChatId = newChat._id;
    }

    await saveUserMessage(targetChatId);
    await saveAiMessage(targetChatId, aiReply);

    return res.status(200).json({
      status: true,
      answer: aiReply,
      chatId: targetChatId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
}

async function aiSuggestion(req, res) {
  try {
    const { userId, organizationId } = req.user;
    const { ticketId } = req.params;
    const { agentDraft } = req.body;

    const user = await userModel.findById(userId);
    if (
      !user ||
      user.organizationId.toString() !== organizationId.toString() ||
      user.role === "customer"
    ) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    if (!ticketId) {
      return res
        .status(400)
        .json({ status: false, message: "Ticket ID is required" });
    }

    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res
        .status(404)
        .json({ status: false, message: "Ticket not found" });
    }

    const messages = await messageModel
      .find({ chatId: ticket.chatId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("sender content");

    const convertedMessages = messages
      .reverse()
      .map(
        (msg) =>
          `${msg.sender === "user" ? "customer" : "agent"} said: ${msg.content}`,
      )
      .join("\n");

    const knowledgeBaseEntries = await knowledgeBaseModel
      .find({ organizationId })
      .select("-_id question answer tags");

    const knowledgeBaseContent = knowledgeBaseEntries
      .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
      .join("\n\n");

    const systemInstruction = `
      You are an AI assistant for a customer support agent. Your job is to polish and enhance the agent's rough draft reply.

      Rules:
      - Keep the agent's original meaning and tone.
      - Correct grammar and spelling.
      - Add relevant details from the knowledge base if helpful.
      - Do NOT add any phrases like "I've created a ticket", "our AI", "customer support team", or any self‑references.
      - The final output should sound like a human agent talking directly to the customer.
      - Keep it concise and helpful.
      - Return ONLY the polished draft, no extra commentary.
    `;

    const userPrompt = `
      Knowledge Base:
      ${knowledgeBaseContent || "No relevant entries."}

      Conversation history (chronological):
      ${convertedMessages || "No previous messages."}

      Agent's rough draft:
      "${agentDraft}"

      Please provide a polished version of the above draft.
    `;

    const aiSuggestionText = await aiService.generateResponse(
      userPrompt,
      knowledgeBaseContent,
      systemInstruction,
    );

    res.status(200).json({ success: true, data: aiSuggestionText });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error processing AI suggestion: ${error.message}`,
    });
  }
}

module.exports = {
  aiResponse,
  aiSuggestion,
};
