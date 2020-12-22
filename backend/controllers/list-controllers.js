const HttpError = require("../util/http-error");
const mongoose = require("mongoose");

const Userlist = require('../models/list-model');
const User = require("../models/user-model");

const newList = async (req,res,next) => {

    const { listName, userId} = req.body;

    let userFound;
    try{
        userFound = await User.findById(userId);
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong.',500));
    }

    if(!userFound){
        next(new HttpError("User not found",500));
    }

    const newList = new Userlist({
        userId,
        listName,
        items:[]
    });

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await newList.save({session:sess});

        userFound.lists.push(newList);
        await userFound.save({session:sess});

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong.',500));
    }

    res.json({list:newList.toObject({getters:true})});
}

const getList = async (req,res,next) => {

    const listId = req.params.listId;

    let listFound;
    try{
        listFound = await Userlist.findById(listId).populate('items');
    }catch(err){
        console.log(err);
        next(new HttpError('Something went wrong.',500));
    }

    if(!listFound){
        next(new HttpError('List not found',500));
    }

    res.json({list:listFound , items:listFound.items.map((item) => item.toObject({getters:true}))});
}


const deleteList = async (req,res,next) => {

    const listId = req.params.listId;

    let listFound;
    try{
        listFound = await Userlist.findById(listId).populate('items');
    }catch(err){
        console.log(err);
        res.status(500);
        res.json({message:"Something went wrong"});
    }

    listFound.items.forEach( async (item) => {
        try{
           await item.remove();
        }catch(err){
            console.log(err);
            res.status(500);
            res.json({message:"Items are not deleted"});
        }
    });

    let userFound;
    try{
        userFound = await User.findById(listFound.userId);
    }catch(err){
        console.log(err);
        res.status(500);
        res.json({message:"Something went wrong"});
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await listFound.remove({ session:sess });

        userFound.lists.pull(listFound);
        await userFound.save({ session:sess });

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        res.status(500);
        res.json({message:"Something went wrong"});
    }

    res.json({message:"List Deleted succesfully"});

}

exports.newList = newList;
exports.getList = getList;
exports.deleteList = deleteList;