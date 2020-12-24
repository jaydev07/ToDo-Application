//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-jaydev:jaydev213@cluster0.e713i.mongodb.net/todo?retryWrites=true&w=majority", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
  name:{type:String , required:true},
  userId:{type:mongoose.Schema.Types.ObjectId , required:true , ref:'User'}
})
const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Hit the + button to add a new item.",
  userId:null
});

const item2 = new Item({
  name: "<-- Hit this to delete an item.",
  userId:null
});

const defaultItems = [item1, item2];

const userSchema = new mongoose.Schema({
  name:{type:String, required:true},
  email:{type:String , required:true},
  password:{type:String , required:true},
  items:[
    {type:mongoose.Schema.Types.ObjectId ,required:true, ref:'Item'}
  ]
})

const User = mongoose.model("User",userSchema);

app.get("/", (req,res) => {
  res.render("auth");
});

app.post("/login", async (req,res) => {
  const {email, password} = req.body;

  let userFound;
  try{
    userFound = await User.findOne({email});
  }catch(err){
    console.log(err);
    res.render('error',{error:"Please login again."});
  }

  if(userFound){
    if(userFound.password === password){
      res.redirect("/"+userFound.id);
    }else{
      res.render('error',{error:"Login faliled.Please enter a valid password"});  
    }
  }else{
    res.render('error',{error:"User not found.Please signup."});
  }
});

// Signup page
app.get("/signup", (req,res) => {
  res.render("signup");
})

app.post("/signup",async (req,res) => {
  const {name , email ,password } = req.body;

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
});

app.get("/:userId" , async (req,res) => {

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
  
});

app.post("/", async (req,res) => {
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
})

app.post("/delete", async (req,res) => {

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

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
