const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.get("/messages-leads-analytics", authMiddleware, adminController.getMessagesLeadsAnalytics);

module.exports = router;
