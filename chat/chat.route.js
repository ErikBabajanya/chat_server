const express = require("express");
const { findUserChats, createChat, findChat } = require("./chat.controller");

const router = express.Router();

router.post("/", createChat);
router.get("/findChats", findUserChats);
router.get("/find/:secondId", findChat);

module.exports = router;
