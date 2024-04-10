const express = require("express");
const {
  getMessages,
  getLastMessage,
  deleteMessage,
} = require("./messages.controller");

const router = express.Router();

router.get("/getMessages/:chatId", getMessages);
router.get("/getLastMessage/:chatId", getLastMessage);
router.delete("/deleteMessage/:chatId", deleteMessage);
module.exports = router;
