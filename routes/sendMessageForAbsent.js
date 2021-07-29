const express = require("express");
const router = express.Router();
const {
  sendMessageForAbsent,
} = require("../controllers/sendMessageForAbsent.js");

router.post("/message", sendMessageForAbsent);

module.exports = router;
