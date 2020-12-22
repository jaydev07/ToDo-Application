const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  listName:{type:String , required:true },
  items:[
      { type:mongoose.Types.ObjectId , required:true , ref:'Item' }
  ],
  userId:{ type:mongoose.Types.ObjectId , required:true , ref:'User'}
});

module.exports = mongoose.model("Userlist",listSchema);