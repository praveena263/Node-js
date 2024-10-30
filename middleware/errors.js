const winston = require("winston");
module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  res.staus(500).send("Something broke!");
};

// module.exports=function(err,req,res,next){
//     try{
//         res.staus(500).send('Something broke!')
//       }
//       catch(ex){
//           next(ex)
//       }
// }
