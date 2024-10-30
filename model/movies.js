const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./geners");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 50 },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 1,
      max: 250,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 1,
      max: 250,
    },
  })
);
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
     genreId:Joi.objectId().required(),
    // genreId:Joi.string().required(),
    numberInStock: Joi.string().min(1).max(250).required(),
    dailyRentalRate: Joi.string().min(1).max(250).required(),
  });
  return schema.validate(movie);
}
exports.Movie = Movie;
exports.validateMovie = validateMovie;
