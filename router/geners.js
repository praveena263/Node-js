const asyncMiddleware=require('../middleware/async')
const {Genres,validator}=require('../model/geners')
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// GET API
router.get("/", asyncMiddleware(async (req, res) => {
  const genres = await Genres.find().sort('name');
  res.send(genres);
}));
// POST API
router.post("/", asyncMiddleware(async (req, res) => {
  const { error } = validator(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  let genres = new Genres({ name: req.body.name });
  genres = await genres.save();
  res.send(genres);
}));

// PUT API
router.put("/:id",asyncMiddleware( async (req, res) => {
  const { error } = validator(req.body);
  if(error) return res.status(400).send(error.details[0].message)
  const genres = await Genres.findByIdAndUpdate( req.params.id , {name:req.body.name} , { new: true});
  if (!genres) return res.status(404).send("The genres with given ID was not found");
  return res.send(genres);
}));
// Delete API
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const genres = await Genres.findByIdAndDelete(req.params.id);
  if (!genres) return res.status(404).send("Genres with given ID is not found");
  res.send(genres);
}));
router.get("/:id", asyncMiddleware(async (req, res) => {
  const genres = await Genres.findById(req.params.id);
  if (!genres) res.status(404).send("The genres with given ID in found");
  res.send(genres);
}));

module.exports = router;
