const  helmate=require('helmate');
const compression =require('compression');

module.exports=function(app){
    app.use(helmate())
    app.use(compression());
}