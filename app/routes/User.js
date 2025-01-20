const express = require("express");
const controller = require("../controllers/UserController");

const router = express.Router();

// Define routes and associate them with controller functions
router.get("/", controller.getUser);
router.post("/signup", controller.signupUser);

module.exports = router;
