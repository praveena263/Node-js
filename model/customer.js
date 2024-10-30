const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    isGold: { type: Boolean, required: true },
    name: {
      type: String,
      required: true,
      minlength: 5,
    },
    phone: { type: Number, required: true, minlength: 5  },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean().required(),
    name: Joi.string().min(5).required(),
    phone: Joi.number().min(5).required(),
  });
  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
