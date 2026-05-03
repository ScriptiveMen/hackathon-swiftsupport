const userModel = require("../models/user.model");
const organizationModel = require("../models/organization.model");
const chatModel = require("../models/chats.model");
const knowledgeBaseModel = require("../models/knowledge.model");
const messageModel = require("../models/message.model");
const ticketModel = require("../models/ticket.model");
const aiService = require("../service/ai.service");

async function aiResponse(req, res) {
  try {
    const { userId, organizationId } = req.user;
    const { question } = req.body;

    const user = await userModel.findById(userId);
    if (!user || user.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    if (!question) {
      return res
        .status(400)
        .json({ status: false, message: "Question is required" });
    }

    const knowledgeBaseEntries = await knowledgeBaseModel
      .find({ organizationId })
      .select("-_id question answer tags");

    // if (!knowledgeBaseEntries) {
    //   return res.status(500).json({ status: false, message: "Failed to fetch knowledge base" });
    // }

    const content =
      knowledgeBaseEntries
        .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
        .join("\n\n") + `\n\nCustomer Question: ${question}`;

    const aiResponseText = await aiService.generateResponse(question, content);

    if (!aiResponseText) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to generate AI response" });
    }

    // If AI suggests creating a ticket
    if (aiResponseText.startsWith("CREATE_TICKET:")) {
      const ticketSummary = aiResponseText.replace("CREATE_TICKET:", "").trim();

      // Improved regex: capture fields more reliably, remove trailing punctuation
      const match = ticketSummary.match(
        /title:\s*(.*?),\s*description:\s*(.*?),\s*priority:\s*(.*?),\s*status:\s*(.*?)(?:\.|$)/i,
      );

      let title = "Support needed";
      let description = question; // fallback to original question
      let priority = "medium";
      let status = "open";

      if (match) {
        title = match[1].trim() || title;
        description = match[2].trim() || question;
        // Normalize priority – ensure valid enum value
        let rawPriority = match[3].trim().toLowerCase();
        if (["low", "medium", "high", "urgent"].includes(rawPriority)) {
          priority = rawPriority;
        }
        // Normalize status – remove any trailing period and ensure valid
        let rawStatus = match[4].trim().toLowerCase().replace(/\.$/, "");
        if (["open", "in-progress", "resolved", "closed"].includes(rawStatus)) {
          status = rawStatus;
        }
      }

      // Create a new chat for this ticket
      const newChat = await chatModel.create({
        organizationId,
        userId,
        status: "active",
      });

      // Create ticket with validated fields
      const newTicket = await ticketModel.create({
        userId,
        organizationId,
        chatId: newChat._id,
        title: title,
        description: description,
        status: status,
        priority: priority,
      });

      // Save the user's original question as a message
      await messageModel.create({
        chatId: newChat._id,
        sender: "user",
        content: question,
      });

      // Optional: save a system message indicating ticket creation
      await messageModel.create({
        chatId: newChat._id,
        sender: "ai",
        content: `I've created a ticket (#${newTicket._id}) for you. An agent will respond soon.`,
      });

      return res.status(200).json({
        status: true,
        message: "Ticket created automatically",
        ticketId: newTicket._id,
        answer:
          "I couldn't answer your question. I've created a support ticket for you. An agent will get back to you shortly.",
      });
    }

    // Normal AI answer (no ticket creation)
    // Save the conversation to an existing chat? You'll need chatId in request.
    // For simplicity, just return the answer.
    res.status(200).json({ status: true, answer: aiResponseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: `Error processing AI response: ${error.message}`,
    });
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

    // fetching the last 5 messages from the chat for context
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

    // fetching knowledge base entries
    const knowledgeBaseEntries = await knowledgeBaseModel
      .find({ organizationId })
      .select("-_id question answer tags");

    const knowledgeBaseContent = knowledgeBaseEntries
      .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
      .join("\n\n");

    // system instruction for AI suggestion
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
