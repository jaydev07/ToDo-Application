const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {check} =require("express-validator");

const User = require("../models/user-model");
const HttpError = require('../util/http-error');
const userControllers = require("../controllers/user-controllers");

router.post("/signup",
            [
                check('name').not().isEmpty(),
                check('email').isEmail(),
                check('password').isLength({min:6})   
            ], userControllers.signup);

router.post("/login",
            [
                check('email').isEmail(),
                check('password').isLength({min:6})
            ], userControllers.login);

router.get("/:userId", userControllers.getListByUserId);


module.exports = router;