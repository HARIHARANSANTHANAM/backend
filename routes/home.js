const express = require("express");
const router = express.Router();
const {
  fetchClassDetails,
  sendId,
} = require("../controllers/fetchClassDetails");

router.param("id", fetchClassDetails);
router.get("/:id", sendId);
module.exports = router;
