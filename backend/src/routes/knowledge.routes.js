const express = require("express");

const router = express.Router();

const {
  getAllFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  searchFAQ,
  bulkUpload
} = require("../controllers/knowledge.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Get Knowledge Base
router.get("/getAllFAQ", authMiddleware, getAllFAQ);

// Create Knowledge Base Entry
router.post('/createFAQ', authMiddleware, createFAQ);

// Bulk Upload Knowledge Base Entries
router.post('/bulkUpload', authMiddleware, bulkUpload);
// // Update Knowledge Base Entry
router.put('/updateFAQ/:id', authMiddleware, updateFAQ)

// // Delete Knowledge Base Entry
router.delete('/deleteFAQ/:id', authMiddleware, deleteFAQ)

// // Search Knowledge Base
router.get('/searchFAQ', authMiddleware, searchFAQ);

module.exports = router;
