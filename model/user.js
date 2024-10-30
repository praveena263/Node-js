const mongoose = require("mongoose");
const Joi = require("joi");
const jwt=require('jsonwebtoken');
const config =require('config')

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, maxlength: 50, required: true },
  email: { type: String, minlength: 5, maxlength: 250, required: true },
  password: { type: String, minlength: 5, maxlength: 250, required: true },
  isAdmin: { type: Boolean, default: false }
});
userSchema.methods.generateAuthToken=function(){
  const token = jwt.sign({ _id: this._id ,isAdmin : this.isAdmin}, config.get("jwtPrivateKey"));
  return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(250).email().required(),
    password: Joi.string().min(5).max(250).required(),
    isAdmin: Joi.boolean().default(false)
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };


