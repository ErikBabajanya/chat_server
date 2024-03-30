const messageModel = require("./messages.model");
const userModel = require("../user/user.model");
const { decodedToken } = require("../jwt/jwt");
const { findUserById } = require("../user/user.service");
const { findMessages, findLastMessages } = require("./messages.service");

const getMessages = async (req, res) => {
  const token = req.headers.authorization;
  const chatId = req.params.chatId;

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }

  const decode = decodedToken(token);

  if (!decode) {
    return res.status(401).json({ error: "Invalid authorization token." });
  }

  const _id = decode._id;

  const user = await findUserById(_id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const messages = await findMessages(chatId);

  try {
    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getLastMessage = async (req, res) => {
  const token = req.headers.authorization;
  const chatId = req.params.chatId;

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }

  const decode = decodedToken(token);

  if (!decode) {
    return res.status(401).json({ error: "Invalid authorization token." });
  }

  const _id = decode._id;

  const user = await findUserById(_id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const lastMessages = findLastMessages(chatId);
    return res.status(200).json({ lastMessages });
  } catch (error) {
    console.error("Error fetching last message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getMessages, getLastMessage };
