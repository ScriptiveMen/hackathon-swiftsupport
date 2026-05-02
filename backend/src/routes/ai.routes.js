const express = require("express");
const aiControllers = require("../controllers/ai.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

/* POST /api/ai/respond */
router.post("/respond", authMiddleware, aiControllers.aiResponse);

/* POST /api/ai/suggest */
router.post("/suggest", authMiddleware, aiControllers.aiSuggestion);

module.exports = router;
