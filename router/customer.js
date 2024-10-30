const mongoose=require('mongoose')
const express=require('express')
const {validateCustomer, Customer}=require('../model/customer')
const router=express.Router()


router.get('/',async(req,res)=>{
  const customers=await Customer.find();
  res.send(customers)
})
router.post('/',async (req,res)=>{
    const { error } = validateCustomer(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    let custs=new Customer({
        name: req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    } )
    custs=await custs.save();
    res.send(custs)
})

router.put('/:id',async (req,res)=>{
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    const cust=await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name},{new : true})
    if (!cust) return res.status(404).send("Customer with given ID was not found")
    res.send(cust)
})

router.delete('/:id',async (req,res)=>{
    const cust=await Customer.findByIdAndDelete(req.params.id);
    if (!cust) return res.status(404).send("Customer with given ID was not found")
    res.send(cust)
})

router.get('/:id',async (req,res)=>{
    const cust=await Customer.findById(req.params.id);
    if (!cust) return res.status(404).send("Customer with given ID was not found")
    res.send(cust)
})

module.exports=router;


