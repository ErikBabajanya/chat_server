const express = require("express");
const {
  findMyUser,
  chageMyUserInfo,
  searchUser,
} = require("./user.controller");
const multer = require("multer");

const router = express.Router();

const upload = multer();

router.get("/findMyUser", findMyUser);
router.put("/chageMyUserInfo", upload.single("picture"), chageMyUserInfo);
router.post("/searchUser", searchUser);

module.exports = router;
