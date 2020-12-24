const express = require("express");
const router = express.Router();

const itemControllers = require("../controllers/items");

router.post("/", itemControllers.addItem);

router.post("/delete", itemControllers.deleteItem);

module.exports =  router;