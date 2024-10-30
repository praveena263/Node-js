const mongoose = require("mongoose");
const express = require("express");
const { Movie,validateMovie } = require("../model/movies");
const { Genres } = require("../model/geners");
//const {genreSchema} = require('./router/geners');
const router = express.Router();

router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("name");
  res.send(movie);
});
router.post("/", async (req, res) => {
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const {error}=validateMovie(req.body)
  if(error) return res.status(404).send(error.details[0].message);

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  if (!movie) return res.status(400).send("Invalid genre");
  await movie.save();
  res.send(movie);
});
router.put("/:id", async (req, res) => {
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("Movie with given Id id not found");
  res.send(movie);
});
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("Movie with given Id id not found");
  res.send(movie);
});
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie with given Id id not found");
  res.send(movie);
});
module.exports = router;
