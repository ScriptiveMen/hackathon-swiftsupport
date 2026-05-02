const userModel = require("../models/user.model");
const knowledgeModel = require("../models/knowledge.model");
const organizationModel = require("../models/organization.model");

// Get Knowledge Base
const getAllFAQ = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;

    // check if user belongs to organization
    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString()) {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const knowledgeBase = await knowledgeModel.find();

    res.status(200).json({ status: true, data: knowledgeBase });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error fetching knowledge base: ${error.message}`,
    });
  }
};

const createFAQ = async (req, res) => {
  try {
    const { organizationId, userId } = req.user;
    let { question, answer, tags } = req.body;

    // Validation
    if (!question || !answer) {
      return res
        .status(400)
        .json({ status: false, message: "Question and answer are required" });
    }

    // Process tags: convert comma-separated string to array, or ensure it's an array
    let tagArray = [];
    if (tags) {
      if (Array.isArray(tags)) {
        tagArray = tags;
      } else if (typeof tags === "string") {
        tagArray = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "");
      }
    }

    // Optional: verify user belongs to organization
    const user = await userModel.findById(userId);
    if (!user || user.organizationId.toString() !== organizationId.toString() || user.role === "customer") {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const newFAQ = await knowledgeModel.create({
      organizationId,
      question,
      answer,
      tags: tagArray, // ✅ use processed array
    });

    res.status(201).json({
      status: true,
      message: "FAQ Created Successfully",
      data: newFAQ,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error creating FAQ: ${error.message}`,
    });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const { organizationId, userId } = req.user;
    const { question, answer, tags } = req.body;

    let tagArray = [];
    if (tags) {
      if (Array.isArray(tags)) {
        tagArray = tags;
      } else if (typeof tags === "string") {
        tagArray = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "");
      }
    }

    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString() || user.role === "customer") {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const existingFAQ = await knowledgeModel.findById(req.params.id);

    if (!existingFAQ) {
      return res.status(404).json({ status: false, message: "FAQ not found" });
    }

    const updateFAQ = await knowledgeModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        question,
        answer,
        tags: tagArray,
      },
      { new: true },
    );

    res.status(200).json({
      status: true,
      message: "FAQ Updated Successfully",
      data: updateFAQ,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error updating FAQ: ${error.message}`,
    });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const { organizationId, userId } = req.user;

    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString() || user.role === "customer") {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    const existingFAQ = await knowledgeModel.findById(req.params.id);

    if (!existingFAQ) {
      return res.status(404).json({ status: false, message: "FAQ not found" });
    }

    await knowledgeModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: true,
      message: "FAQ Deleted Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Error deleting FAQ: ${error.message}` });
  }
};

const searchFAQ = async (req, res) => {
  try {
    const { userId, organizationId } = req.user;
    let { q } = req.query; // <-- use "q" instead of "query"

    // Validate
    if (!q || typeof q !== "string" || q.trim() === "") {
      return res
        .status(400)
        .json({
          status: false,
          message: "Search query is required and must be a non-empty string",
        });
    }

    // Escape regex special characters to prevent errors and injection
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeQuery = escapeRegex(q.trim());

    // Authorization: only admin/agent (or adjust as needed)
    const user = await userModel.findById(userId);

    if (!user || user.organizationId.toString() !== organizationId.toString() || user.role === "customer") {
      return res.status(403).json({ status: false, message: "Unauthorized access" });
    }

    const searchResult = await knowledgeModel.find({
      organizationId,
      $or: [
        { question: { $regex: safeQuery, $options: "i" } },
        { answer: { $regex: safeQuery, $options: "i" } },
        { tags: { $regex: safeQuery, $options: "i" } },
      ],
    });

    res.status(200).json({ status: true, data: searchResult });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: `Error searching FAQ: ${error.message}`,
      });
  }
};

module.exports = {
  getAllFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  searchFAQ,
};
