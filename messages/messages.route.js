const express = require("express");
const { getMessages, getLastMessage } = require("./messages.controller");

const router = express.Router();

router.get("/getMessages/:chatId", getMessages);
router.get("/getLastMessage/:chatId", getLastMessage);

module.exports = router;
