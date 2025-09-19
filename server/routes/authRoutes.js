const express =reruire("express");
const { registerUser, loginUser } = require ("../controllers/authController.js");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

modules.exports  =  router;
