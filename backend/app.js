const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(bodyParser.json());

const userRoutes = require("./routes/user-routes");
const listRoutes = require("./routes/list-routes");
const itemRoutes = require("./routes/item-routes");
const HttpError = require("./util/http-error");

app.use((req,res,next) => {
    // Header used to patch the backend with Frontend
    // It will allow the access form any browser NOT ONLY localhost:3000
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next();
})

app.use("/api/user", userRoutes);

app.use("/api/list", listRoutes);

app.use("/api/item",itemRoutes);    

app.use((req,res,next) => {
    next(new HttpError("Could not find the route",404));
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({message:error.message || "Something went wrong"});
})

mongoose
    .connect("mongodb+srv://admin-jaydev:jaydev213@cluster0.e713i.mongodb.net/todo?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        app.listen(5000,function(){
            console.log("server is listening on port 5000");
        });
    })
    .catch((err) => {
        console.log(err)
    })

