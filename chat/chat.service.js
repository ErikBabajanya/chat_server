const chatModel = require("./chat.model");
const messageModel = require("../messages/messages.model");
const { findUserByPhoneNumber, findUserById } = require("../user/user.service");

const findChatWithTwoUsersId = async (firstId, secondId) => {
  const chat = await chatModel.findOne({
    members: { $all: [firstId, secondId] },
  });

  return chat;
};

const findMyUsers = async (userId) => {
  const chats = await chatModel.find({
    members: { $in: [userId] },
  });
  if (chats.length === 0) {
    return [];
  }
  const messages = await Promise.all(
    chats.map(async (chat) => {
      const mychats = await messageModel
        .findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .limit(1);

      if (mychats) return mychats;
    })
  );
  const filteredMessages = messages.filter((message) => message !== undefined);

  let sortMessages = [];
  if (filteredMessages.length) {
    sortMessages = filteredMessages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  const users = await Promise.all(
    sortMessages.map(async (message) => {
      let id, user;
      if (message.senderId === userId) {
        id = message.recipientId;
      } else {
        id = message.senderId;
      }
      user = await findUserById(id);
      return {
        user: user,
        lastMsg: message,
      };
    })
  );
  return users;
};

const findSpecificChat = async (firstId, secondId) => {
  const chat = await chatModel.findOne({
    $or: [
      { members: { $all: [firstId, secondId] } },
      { members: { $all: [secondId, firstId] } },
    ],
  });

  return chat;
};

const createNewChat = async (firstId, secondId) => {
  const newChat = new chatModel({
    members: [firstId, secondId],
  });

  const chat = await newChat.save();

  return chat;
};

module.exports = {
  findChatWithTwoUsersId,
  createNewChat,
  findMyUsers,
  findSpecificChat,
};
