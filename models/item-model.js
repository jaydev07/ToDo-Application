const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
    name:{type:String , required:true},
    userId:{type:mongoose.Schema.Types.ObjectId , required:true , ref:'User'}
  })

module.exports = mongoose.model("Item", itemsSchema);
  