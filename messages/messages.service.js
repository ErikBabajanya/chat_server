const messageModel = require("./messages.model");

const findMessages = async (chatId) => {
  const messages = await messageModel.find({ chatId: chatId });
  return messages;
};

const findLastMessages = async (chatId) => {
  const lastMessages = await messageModel
    .findOne({ chatId: chatId })
    .sort({ createdAt: -1 })
    .limit(1);

  return lastMessages;
};

module.exports = {
  findMessages,
  findLastMessages,
};
