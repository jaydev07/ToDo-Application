const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");

router.get("/", userControllers.getLoginPage);

router.get("/signup", userControllers.getSignupPage);

router.post("/login", userControllers.login);

router.post("/signup",userControllers.signup);

router.get("/:userId" , userControllers.getUserById);

module.exports =  router;