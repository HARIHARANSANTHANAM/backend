const express = require("express");
const router = express.Router();
const {
  fetchStudentList,
  sendId,
} = require("../controllers/fetchStudentsList.js");

router.param("id", fetchStudentList);
router.get("/:id", sendId);

module.exports = router;
