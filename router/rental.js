const { Rental, validateRental } = require("../model/rental");
const { Movie } = require("../model/movies");
const { Customer } = require("../model/customer");
const mongoose = require('mongoose');
const Fawn = require('fawn');
//Initialize Fawn
// Connect to MongoDB using Mongoose
//mongoose.connect('mongodb://localhost/vidly')

    //console.log('Connected to MongoDB...');
    // Initialize Fawn with the Mongoose instance
   Fawn.init(mongoose);

  //.catch((err) => console.error('Could not connect to MongoDB:', err));

const express = require("express");
const router = express.Router();

//const {Rent,validateRentals} =require('../model/rentals.js')
router.get("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const rent = await Rental.find().sort("-dateOut");
  res.send(rent);
});
router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");
  let rent = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  // rent = await rent.save();
  // movie.numberInStock--;
  // await movie.save();
  // res.send(rent)
   try {
    new Fawn.Task()
      .save("rentals", rent)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rent);
  } catch (ex) {
    res.status(500).send("Someting failed");
  }
});
router.put("/:id", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const rent = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      typeOfRental: req.body.typeOfRental,
      amount: req.body.amount,
    },
    { new: true }
  );
  if (!rent)
    return res.status(404).send("The movie with the given ID was not found.");
  res.send(rent);
});
router.delete("/:id", async (req, res) => {
  const rent = await Rental.findByIdAndDelete(req.params.id);
  if (!rent) return res.status(404).send("Given id does not found");
  res.send(rent);
});
router.get("/:id", async (req, res) => {
  const rent = await Rental.findById(req.params.id);
  if (!rent) return res.status(404).send("Given Id is found");
  res.send(rent);
});
module.exports = router;
