require('express-async-errors');
winston = require("winston");
require('winston-mongodb');

module.exports=function(){
// Configure Winston transports
winston.exceptions.handle(
new winston.transports.File({ filename: "uncaughtExceptions.log" }));
winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(new winston.transports.MongoDB({
  db: "mongodb://localhost/vidly",
  level: "info",
}));
// Handle unhandled rejections
process.on("unhandledRejection", (ex) => {
  throw ex;
});
}