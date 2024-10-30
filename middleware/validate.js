
module.exports=(validator)=>{
    return (req,res,next)=>{
        const {error} =validateReturn(req.body);
        if (error) return es.status(400).send(error.details[0].message);
    next()
    }
}
