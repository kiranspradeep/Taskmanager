const express = require("express");
const { updateProfile, changePassword } = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/", auth, updateProfile);
router.put("/password", auth, changePassword);

module.exports = router;
