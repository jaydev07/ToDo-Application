const mongoose = require("mongoose");
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Item = require("../models/item-model");
const User = require("../models/user-model");

const item1 = new Item({
  name: "Hit the + button to add a new item.",
  userId:null
});

const item2 = new Item({
  name: "<-- Hit this to delete an item.",
  userId:null
});

const getLoginPage = (req,res) => {
  res.render("auth");
}

const getSignupPage = (req,res) => {
  res.render("signup");
}

const signup = async (req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.render('error',{error:"Please entery valid details & password of minimum 5 characters."});
    }

    bcrypt.hash(req.body.password , saltRounds , async (err ,hash) => {
      const name = req.body.name;
      const email = req.body.email;
      const password = hash;

      let userExists;
      try{
        userExists = await User.findOne({email});
      }catch(err){
        console.log(err);
        res.render('error',{error:'Please try again.'});
      }

      if(userExists){
        return res.render('error',{error:"User already exists.Please login."});
      }
    
      const newUser = new User({
        name,
        email,
        password,
        items:[]
      });
    
      try{
        await newUser.save();
      }catch(err){
        console.log(err);
        return res.render('error',{error:"Please signup again."});
      }
      const user = newUser.toObject({getters:true});
    
      try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
    
        item1.userId = user.id;
        await item1.save({session:sess});
    
        item2.userId = user.id;
        await item2.save({session:sess});
    
        newUser.items.push(item1);
        newUser.items.push(item2);
        await newUser.save({session:sess}); 
    
        sess.commitTransaction();
      }catch(err){
        console.log(err);
        res.render('error',{error:'Please try again.'});
      }
      
      res.redirect('/'+ user.id);
    })
    
  }


  const login = async (req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.render('error',{error:"Please entery valid details & password of minimum 5 characters."});
    }
    
    const {email, password} = req.body;
  
    let userFound;
    try{
      userFound = await User.findOne({email});
    }catch(err){
      console.log(err);
      res.render('error',{error:"Please login again."});
    }
  
    if(userFound){
      bcrypt.compare(password , userFound.password , function(err,result){
        if(result === true){
          res.redirect("/"+userFound.id);
        }else{
          res.render('error',{error:"Login faliled.Please enter a valid password"});  
        }
      });
    }else{
      res.render('error',{error:"User not found.Please signup."});
    }
  }

  const getUserById = async (req,res) => {

    const userId = req.params.userId;
  
    let userFound;
    try{
      userFound = await User.findById(userId).populate('items');
    }catch(err){
      console.log(err);
      return res.render('error',{error:'User not found.'});
    }
  
    const user = userFound.toObject({getters:true});
  
    res.render("list" , {user:user , listTitle:"Welcome to your ToDo List" , newListItems:userFound.items.map((item) => item.toObject({getters:true}))})
    
  }

  exports.signup = signup;
  exports.login = login;
  exports.getUserById = getUserById;
  exports.getLoginPage = getLoginPage;
  exports.getSignupPage = getSignupPage;