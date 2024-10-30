const winston = require("winston");
const mongoose=require('mongoose');
//require('./config')
//delete require.cache[require.resolve('config')];
const config = require("config");

module.exports=function(){
    let db=config.get('db')
    mongoose.connect(db)
       .then(() => winston.info(`Connected to Mongodb ${db}......`))
       .catch(err=>console.log('Not connected',err))
}

