const auth=require('../middleware/auth')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const { User, validateUser } = require('../model/user');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body);
  if (!req.body) {
    return res.status(400).send("Request body is missing or empty.");
  }
  // Validate the request body
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if a user with the same email already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) return res.status(400).send('User with the same email is already registered');

  // Create a new user
  let user = new User(_.pick(req.body, ['name', 'email', 'password']));

  // Hash the user's password before saving it to the database
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Save the user to the database
  await user.save();

  // Generate a JWT token
  const token = user.generateAuthToken(); // Replace 'yourPrivateKey' with your actual private key

  // Send the token back to the client in the response headers or body
  
  res.header('x-auth-token', auth , token).send(_.pick(user, ['_id', 'name', 'email']));
});

// router.delete('/',auth ,async(req,res)=>{
//   const user=await User.findByIdAndDelete(req.params.id)
//   if(!user) return res.status(400).send('Given id is found')
//   req.send(user) 

// })
router.get('/me',auth,async(req,res)=>{
  const user=await User.findById(req.user._id).select('-password');
  res.send(user)
  //to get this api work we have to give headers -> x-auth-token -> value use user token
})

module.exports = router;