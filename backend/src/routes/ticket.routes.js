const exprss = require("express");
const router = exprss.Router();

const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  ticketAssginedToAgent,
  ticketStatusUpdate,
} = require("../controllers/ticket.controller.js");

const authMiddleware = require("../middleware/auth.middleware.js");

const validators = require("../validators/ticket.validators.js");

//GET /api/tickets/getAllTickets
router.get("/getAllTickets", authMiddleware, getAllTickets);

//GET /api/tickets/getTicketById/:id
router.get("/getTicketById/:id", authMiddleware, getTicketById);

//POST /api/tickets/createTicket
router.post("/createTicket", authMiddleware, validators.ticketValidations , createTicket);

//PUT /api/tickets/updateTicket/:id 
router.put("/updateTicket/:id", authMiddleware, validators.ticketValidations, updateTicket);

//DELETE /api/tickets/deleteTicket/:id
router.delete("/deleteTicket/:id", authMiddleware, deleteTicket);

//PUT /api/tickets/ticketAssginedToAgent/:id
router.put("/ticketAssginedToAgent/:id", authMiddleware, ticketAssginedToAgent);

//PUT /api/tickets/ticketStatusUpdate/:id
router.put("/ticketStatusUpdate/:id", authMiddleware, ticketStatusUpdate);

module.exports = router;