const ticketModel = require("../models/ticket.model.js");

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find();

    res.status(200).json({
      status: "true",
      message: "Tickets fetched successfully",
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: "Error fetching tickets",
      error: error.message,
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res
        .status(404)
        .json({ status: "false", message: "Ticket not found" });
    }

    res.status(200).json({
      status: "true",
      message: "Ticket fetched successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: `Error fetching ticket: ${error.message}`,
    });
  }
};

const createTicket = async (req, res) => {
  try {
    const { userId, organizationId, chatId } = req.user.userId;
    const { title, description, status, priority } = req.body;

    const newTicket = await ticketModel.create({
      userId,
      organizationId,
      chatId,
      title,
      description,
      status,
      priority,
    });

    res.status(201).json({
      status: "true",
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: `Error creating ticket: ${error.message}`,
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { title, description, status, priority } = req.body;

    const updatedTicket = await ticketModel.findByIdAndUpdate(
      ticketId,
      { title, description, status, priority },
      { new: true },
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ status: "false", message: "Ticket not found" });
    }

    res
      .status(200)
      .json({
        status: "true",
        message: "Ticket updated successfully",
        data: updatedTicket,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "false",
        message: `Error updating ticket: ${error.message}`,
      });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const deletedTicket = await ticketModel.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res
        .status(404)
        .json({ status: "false", message: "Ticket not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Ticket deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "false",
        message: `Error deleting ticket: ${error.message}`,
      });
  }
};

const ticketAssginedToAgent = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { agentId } = req.body;

    const updatedTicket = await ticketModel.findByIdAndUpdate(
      ticketId,
      { assignedTo: agentId },
      { new: true },
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ status: "false", message: "Ticket not found" });
    }

    res
      .status(200)
      .json({
        status: "true",
        message: "Ticket assigned to agent successfully",
        data: updatedTicket,
      });
  } catch {
    res
      .status(500)
      .json({
        status: "false",
        message: `Error assigning ticket to agent: ${error.message}`,
      });
  }
};

const ticketStatusUpdate = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    const updatedTicket = await ticketModel.findByIdAndUpdate(
      ticketId,
      { status: status },
      { new: true },
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ status: "false", message: "Ticket not found" });
    }

    res
      .status(200)
      .json({
        status: "true",
        message: "Ticket status updated successfully",
        data: updatedTicket,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "false",
        message: `Error updating ticket status: ${error.message}`,
      });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  ticketAssginedToAgent,
  ticketStatusUpdate,
};
