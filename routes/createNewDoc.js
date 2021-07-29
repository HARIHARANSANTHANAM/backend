const express = require("express");
const router = express.Router();
const { createNewDoc } = require("../controllers/createNewDoc.js");

router.get("/docs", createNewDoc);

module.exports = router;
