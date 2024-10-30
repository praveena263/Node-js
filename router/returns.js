const Joi = require("joi");
const { Rental } = require("../model/rental");
const { Movie } = require("../model/movies");
const validate = require("../middleware/validate");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(customerId, movieId);
  if (!rental) return res.status(404).send("Rental not found");
  if (rental.dateReturned)
    return res.status(400).send("Return is already processed");
  
  rental.return();
  await rental.save()
 
  await Movie.uddate(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  await rental.save();

  return res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.ObjectId().required(),
    movieId: Joi.ObjectId().required(),
  });
  return schema.validate(req);
}
module.exports = router;
