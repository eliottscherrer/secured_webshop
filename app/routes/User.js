const express = require("express");
const controller = require("../controllers/UserController");

const router = express.Router();

// Define routes and associate them with controller functions
router.get("/:username", controller.getUser);
router.post("/signup", controller.signupUser);
router.post("/login", controller.loginUser);
router.post("/logout", controller.logoutUser);

module.exports = router;
