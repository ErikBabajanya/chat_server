const express = require("express");
const { findMyUser, chageMyUserInfo } = require("./user.controller");
const multer = require("multer");

const router = express.Router();

const upload = multer();

router.get("/findMyUser", findMyUser);
router.put("/chageMyUserInfo", upload.single("picture"), chageMyUserInfo);

module.exports = router;
