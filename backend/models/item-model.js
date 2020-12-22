const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name:{type:String , required:true},
    listId:{type:mongoose.Types.ObjectId , required:true , ref:'Userlist'}
});

module.exports = mongoose.model('Item',itemSchema);