const express = require("express");
const rentals = require("../router/rental");
const generes = require("../router/geners");
const customer = require("../router/customer");
const movies = require("../router/movies");
////const genre = require("../router/genre");
const user = require("../router/user");
const auth = require("../router/auth");
const error = require("../middleware/errors");
const returns=require('../router/returns')


module.exports=function(app){
app.use(express.json());
app.use("/api/rentals", rentals);
app.use("/api/generes", generes);
app.use("/api/customer", customer);
app.use("/api/movies", movies);
//app.use("/api/genre", genre);
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/returns", returns);
// Error handling middleware
app.use(error);
}