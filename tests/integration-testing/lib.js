const db = require("../mock/db");
const mail=require('./mail')
//Mock functions
module.exports.notifyCustomer = function (order) {
  const customer = db.getCustomerSync(order.customerId);

 mail.send(customer.email,'Your order was placed successfully.')
};
