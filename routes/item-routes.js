const express = require("express");
const router = express.Router();
const {check} = require("express-validator");

const itemControllers = require("../controllers/items");

router.post("/",
            [
                check('newItem').not().isEmpty()
            ], itemControllers.addItem);

router.post("/delete", itemControllers.deleteItem);

module.exports =  router;