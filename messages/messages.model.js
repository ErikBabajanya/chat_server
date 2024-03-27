const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    recipientId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Messages", messageSchema);

module.exports = messageModel;
