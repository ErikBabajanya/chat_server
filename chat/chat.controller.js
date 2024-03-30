const chatModel = require("./chat.model");

const { decodedToken } = require("../jwt/jwt");
const {
  findChatWithTwoUsersId,
  createNewChat,
  findMyUsers,
  findSpecificChat,
} = require("../chat/chat.service");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await findChatWithTwoUsersId(firstId, secondId);

    if (chat) return res.status(200).json(chat);

    const newChat = await createNewChat(firstId, secondId);
    if (!newChat) return res.status(401).json({ error: "request faild" });
    res.status(200).json(newChat);
  } catch (error) {
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const token = req.headers.authorization;
  const decode = decodedToken(token);
  const userId = decode._id;
  try {
    const users = await findMyUsers(userId);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const token = req.headers.authorization;

  const secondId = req.params.secondId;
  try {
    if (!token) return res.status(400).json({ error: "token note found" });
    const decode = decodedToken(token);

    if (!decode) return res.status(401).json({ error: "authentikation faild" });
    const firstId = decode._id;

    const chat = await findSpecificChat(firstId, secondId);

    if (!chat) return res.status(404).json({ error: "chat note found" });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createChat, findUserChats, findChat };
