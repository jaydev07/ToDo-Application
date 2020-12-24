//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const userRoutes = require('./routes/user-routes');
const itemRoutes = require("./routes/item-routes");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(userRoutes);

app.use(itemRoutes);

mongoose
  .connect("mongodb+srv://admin-jaydev:jaydev213@cluster0.e713i.mongodb.net/todo?retryWrites=true&w=majority", {useNewUrlParser: true})
  .then(() => {
    app.listen(process.env.PORT || 3000, function() {
      console.log("Server started on port 3000");
    });    
  })
  .catch((err) => {
    console.log(err);
  })

