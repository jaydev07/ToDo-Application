const mongoose = require('mongoose');
const {validationResult} =require("express-validator");

const Item = require("../models/item-model");
const Userlist = require("../models/list-model");
const HttpError = require('../util/http-error');


const newItem = async (req,res,next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(500);
        res.json({message:"Invalid Input.Please enter a valid input"});
    }

    const {name , listId} = req.body;

    let listFound;
    try{
        listFound = await Userlist.findById(listId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong.',500));
    }

    if(!listFound){
        next(new HttpError("List not found",500));
    }

    const newItem= new Item({
        name,
        listId
    });

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await newItem.save({session:sess});

        listFound.items.push(newItem);
        await listFound.save({session:sess});

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong.',500));
    }

    res.json({item:newItem.toObject({getters:true})});
}

const deleteItem = async (req,res,next) => {

    const itemId = req.params.itemId;

    let itemFound;
    try{
        itemFound = await Item.findById(itemId).populate('listId');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong.',500));
    }

    if(!itemFound){
        next(new HttpError("Item not found",500));
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await itemFound.remove({session:sess});

        itemFound.listId.items.pull(itemFound);
        await itemFound.listId.save({session:sess});

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        res.status(500);
        res.json({message:"Something went wrong"});
    }

    res.json({message:"Deleted successfully"});

}

exports.newItem = newItem;
exports.deleteItem = deleteItem;