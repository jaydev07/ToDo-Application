const express = require("express");
const router = express.Router();
const {check} = require("express-validator");

const userControllers = require("../controllers/user");

router.get("/", userControllers.getLoginPage);

router.get("/signup",userControllers.getSignupPage);

router.post("/login",
            [
                check('email').isEmail(),
                check('password').isLength({min:5})
            ], userControllers.login);

router.post("/signup",
            [
                check('name').not().isEmpty(),
                check('email').isEmail(),
                check('password').isLength({min:5})
            ],userControllers.signup);

router.get("/:userId" , userControllers.getUserById);

module.exports =  router;