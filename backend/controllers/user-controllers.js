const HttpError = require("../util/http-error");
const mongoose = require("mongoose");
const {validationResult} = require("express-validator");

const Userlist = require('../models/list-model');
const User = require("../models/user-model");

const signup = async (req,res,next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(500);
        res.json({message:"Invalid Input.Please enter a valid input"})
    }

    const {name , email , password } = req.body;

    const newUser = new User({
        name,
        email,
        password,
        list:[
            {
                listname:"Daily Work",
                items:[{
                    name:"Press + to add an activity",
                },{
                    name:"Press box to remove the activity"
                }]
            }
        ]
    });

    try{
        await newUser.save();
    }catch(err){
        console.log(err);
        res.status(500);
        res.json({message:"Signup failed.Please try again"});
    }

    res.json({user:newUser.toObject({getters:true})});
}

const login = async (req,res,next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(500);
        res.json({message:"Invalid Input.Please enter a valid input"})
    }

    const {email ,password } = req.body;

    let user;
    try{
        user = await User.findOne( { email:email } );
    }catch(err){
        res.status(500);
        res.json({message:"Something went wrong.Please try again"});
    }

    if( !user || user.password !== password){
        next(new HttpError("Login failed.Please try again",500));
    }else{
        res.json({user:user.toObject({getters:true})});
    }
    
}

const getListByUserId = async (req,res,next) => {

    const userId = req.params.userId;

    let userFound;
    try{
        userFound = await User.findById(userId).populate('lists') 
    }catch(err){
        res.status(500);
        res.json({message:"Something went worng"});
    }

    userFound.lists.forEach( async (list) => {
        try{
            console.log(list.populate('items'));
        }catch(err){
            console.log(err);
        }
    })

    if(!userFound){
        next(new HttpError("User not found",500));
    }

    res.json({user:userFound.toObject({getters:true})});

}

exports.signup = signup;
exports.login = login;
exports.getListByUserId = getListByUserId;