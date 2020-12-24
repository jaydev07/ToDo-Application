const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String , required:true},
    password:{type:String , required:true},
    items:[
      {type:mongoose.Schema.Types.ObjectId ,required:true, ref:'Item'}
    ]
  })
  
module.exports = mongoose.model("User",userSchema);