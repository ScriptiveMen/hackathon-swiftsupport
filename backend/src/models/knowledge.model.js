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
    tags: [String], // helps in better search
  },
  { timestamps: true },
);

const knowledgeModel = mongoose.model("Knowledge", knowledgeSchema);
module.exports = knowledgeModel;
