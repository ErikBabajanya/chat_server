const chatModel = require("./chat.model");
const messageModel = require("../messages/messages.model");
const decodedToken = require("../jwt");
const { findUserByPhoneNumber, findUserById } = require("../user/user.service");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const token = req.headers.authorization;
  const decode = decodedToken(token);
  const userId = decode._id;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

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

    const members = await Promise.all(
      chats.map((chat) => {
        if (chat.members[0] == userId) {
          const id = chat.members[1];
          return findUserById(id);
        } else {
          const id = chat.members[0];
          return findUserById(id);
        }
      })
    );

    // const users = await Promise.all(
    //   members.map(async (id) => {
    //     return await findUserById(id);
    //   })
    // );

    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const token = req.headers.authorization;
  const decode = decodedToken(token);
  const firstId = decode._id;
  const secondId = req.params.secondId;
  try {
    const chat = await chatModel.findOne({
      $or: [
        { members: { $all: [firstId, secondId] } },
        { members: { $all: [secondId, firstId] } },
      ],
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, findUserChats, findChat };
