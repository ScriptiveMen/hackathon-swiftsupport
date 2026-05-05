const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
    },
    category: {
      type: String,
      default: "Billing",
    },
    status: {
      type: String,
      enum: ["Synced", "Pending"],
      default: "Pending",
    },
    tags: [String], // helps in better search
  },
  { timestamps: true },
);

const knowledgeModel = mongoose.model("Knowledge", knowledgeSchema);
module.exports = knowledgeModel;
