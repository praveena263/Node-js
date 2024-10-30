const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlangth: 50,
    },
  })
const Genres = mongoose.model("Genre",genreSchema);
function validateGenres(genre) {
    let schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
    });
    return schema.validate(genre);
  }
  exports.genreSchema=genreSchema;
  exports.Genres=Genres;
  exports.validator=validateGenres