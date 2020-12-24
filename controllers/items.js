const mongoose = require("mongoose");
const {validationResult} = require("express-validator");

const Item = require("../models/item-model");
const User = require("../models/user-model");

const addItem = async (req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.render('error',{error:"Please entery valid a item."});
    }
    
    const name = req.body.newItem;
    const userId = req.body.userId;
  
    const newItem = new Item({
      name,
      userId
    });
  
    let userFound;
    try{
      userFound = await User.findById(userId);
    }catch(err){
      console.log(err);
      res.render("error",{error:'User not found.'});
    }
  
    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
  
      await newItem.save({session:sess});
  
      userFound.items.push(newItem);
      await userFound.save({session:sess});
  
      sess.commitTransaction();
    }catch(err){
      console.log(err);
      res.render('error',{error:'Item not saved.Please try again.'});
    }
  
    res.redirect('/'+userId);
  }

  const deleteItem = async (req,res) => {

    const itemId = req.body.checkbox;
    const userId = req.body.userId;
  
    console.log(userId);
  
    let userFound;
    try{
      userFound = await User.findById(userId);
    }catch(err){
      console.log(err);
      res.render('error',{error:'User not found'});
    }
  
    let itemFound;
    try{
      itemFound = await Item.findById(itemId);
    }catch(err){
      console.log(err);
      res.render('error',{error:'Item not found'});
    }
  
    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
  
      await itemFound.remove({session:sess});
  
      userFound.items.pull(itemFound);
      userFound.save({session:sess});
  
      sess.commitTransaction(); 
    }catch(err){
      console.log(err);
      res.render("error",{error:'Item is not deleted.Please try again.'});
    }
  
    res.redirect("/"+userId);
  
  }

  exports.addItem = addItem;
  exports.deleteItem = deleteItem;