const express = require("express");
const { findMyUser } = require("./user.controller");

const router = express.Router();

router.get("/findMyUser", findMyUser);

module.exports = router;
