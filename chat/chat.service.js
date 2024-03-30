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
  console.log(chats);
  const users = await Promise.all(
    chats.map(async (chat) => {
      try {
        const msg = await messageModel
          .findOne({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .limit(1);

        let id, user;
        if (chat.members[0] == userId) {
          id = chat.members[1];
        } else {
          id = chat.members[0];
        }
        user = await findUserById(id);
        return {
          user: user,
          lastMsg: msg,
        };
      } catch (error) {
        console.error("Error occurred:", error);
        return null;
      }
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
