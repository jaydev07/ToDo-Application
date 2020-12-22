const express = require('express');
const router = express.Router();
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");
const { check } = require("express-validation");

const Userlist = require('../models/list-model');
const User = require("../models/user-model");
const listControllers = require("../controllers/list-controllers");

router.get("/:listId", listControllers.getList);

router.post("/", listControllers.newList);

router.delete("/:listId" , listControllers.deleteList);

module.exports = router;