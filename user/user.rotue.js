const express = require("express");
const { findMyUser, chageMyUserInfo } = require("./user.controller");

const router = express.Router();

router.get("/findMyUser", findMyUser);
router.put("/chageMyUserInfo", chageMyUserInfo);

module.exports = router;
