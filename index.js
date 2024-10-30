// const config = require("config");
// const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
// const mongoose = require("mongoose");
const winston = require("winston");
const express = require("express");
const app = express();
// const rentals = require("./router/rentals01");
// const generes = require("./router/geners");
// const customer = require("./router/customer");
// const movies = require("./router/movies");
// const genre = require("./router/genre");
// const user = require("./router/user");
// const auth = require("./router/auth");
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/logging')()
require('./startup/config')()
require('./startup/validation')()

// Configure Winston transports
// winston.exceptions.handle(new winston.transports.File({ filename: "uncaughtExceptions.log" }));
// winston.add(new winston.transports.File({ filename: "logfile.log" }));
// winston.add(new winston.transports.MongoDB({
//   db: "mongodb://localhost/vidly",
//   level: "info",
// }));

// Handle unhandled rejections
// process.on("unhandledRejection", (ex) => {
//   throw ex;
// });

// Ensure jwtPrivateKey is defined
// if (!config.get('jwtPrivateKey')) {
//   console.error('FATAL ERROR: jwtPrivateKey is not defined.');
//   process.exit(1);
// }

const port = process.env.PORT || 3000;
const server=app.listen(port, () => winston.info(`Listening on port ${port} ....`))

module.exports=server



