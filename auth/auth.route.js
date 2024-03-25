const express = require("express");

const { login, verify } = require("./auth.controller");

const router = express.Router();

router.post("/", login);
router.post("/verify", verify);

module.exports = router;
