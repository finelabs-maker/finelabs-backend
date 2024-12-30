const express = require("express");
const {
  createMember,
  getMembers,
  deleteMember,
} = require("../controllers/memberController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-member", authenticate, createMember);
router.get("/get-members", authenticate, getMembers);
router.delete("/delete-member/:memberId", authenticate, deleteMember);

module.exports = router;
