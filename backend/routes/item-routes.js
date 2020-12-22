const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {check} = require('express-validator');

const Item = require("../models/item-model");
const Userlist = require("../models/list-model");
const HttpError = require('../util/http-error');
const itemControllers = require("../controllers/item-controllers");

router.get("/:itemId", async (req,res,next) => {

    const itemId = req.params.itemId;

    let itemFound;
    try{
        itemFound = await Item.findById(itemId);
    }catch(err){
        console.log(err);
        res.status(500);
        return res.json({message:"Something went wrong"});
    }

    if(!itemFound){
        res.status(500);
        return res.json({message:"Item not found"});
    }

    res.json({item:itemFound.toObject({getters:true})});
    
})

router.post("/",[
    check('name').not().isEmpty(),
    check('listId').not().isEmpty()
], itemControllers.newItem);

router.delete("/:itemId", itemControllers.deleteItem);

module.exports = router;