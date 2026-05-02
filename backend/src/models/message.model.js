const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    sender: {
      type: String,
      enum: ["user", "ai", "agent"],
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;
