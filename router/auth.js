const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Joi=require('joi')
const express = require("express");
const _ = require("lodash");
const { User } = require("../model/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid password or email.");
  
     user = new User(_.pick(req.body,['name','email','password']));
    const vvalidPassword=await bcrypt.compare(req.body.password,user.password)
    if (!vvalidPassword) return res.status(400).send("Invalid password or email.");

   res.send(true)


  //   const salt=await bcrypt.genSalt(10);
  //    user.password=await bcrypt.hash(user.password,salt)
  //    await user.save()
  //   const validPassword = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPassword) res.status(400).send("Invalid password or email.");

  // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  // res.header('x-auth-token',token).send(user,['_id','name','email']);
  // res.send(token);
})


function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router;
