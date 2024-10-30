const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");

// Joi.objectId=require('joi-objectid')(Joi)
//equire('joi-objectid')(Joi);
const rentalSchema= new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5000,
      },
      isGold: { type: Boolean, default:false },
      phone: { type: Number, required: true, min: 5 },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 250,
        trim: true,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
})
rentalSchema.statics.lookup=function(customerId,movieId){
  return this.findOne({
    'customer._id':customerId,
    'movie._id':movieId,
})
}
rentalSchema.methods.return=function(){
  this.dateReturned = new Date();
  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;

}
const Rental = mongoose.model("Rental",rentalSchema);
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
    // customerId: Joi.string().required(),
    // movieId: Joi.string().required(),
  });
  return schema.validate(rental);
}
exports.Rental=Rental;
exports.validateRental = validateRental;
