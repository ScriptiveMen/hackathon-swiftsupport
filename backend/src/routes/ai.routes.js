const express = require("express");
const aiControllers = require("../controllers/ai.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const validators = require("../validators/ai.validators.js");

const router = express.Router();

/* POST /api/ai/respond */
router.post("/respond", authMiddleware, validators.aiResponseValidations, aiControllers.aiResponse);

/* POST /api/ai/suggest */
router.post("/suggest/ticket/:ticketId", authMiddleware, validators.aiSuggestValidations, aiControllers.aiSuggestion);

module.exports = router;
