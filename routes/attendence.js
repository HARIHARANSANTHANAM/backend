const express = require("express");
const router = express.Router();
const { updateDatabase } = require("../controllers/UpdateDatabase.js");

router.post("/attendance", updateDatabase);

module.exports = router;
