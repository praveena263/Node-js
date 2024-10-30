const request=require('supertest')
const moment = require('moment')
const { Rental } = require("../../model/rental");
const { Movie } = require("../../model/movies");

const { User } = require("../../model/user");
const mongoose = require("mongoose");

describe(".api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let  movie;
  let token;
  const exec=async()=>{
    return await request(server)
    .post('/api/returns')
    .set('x-auth-token',token)
    .send({customerId,movieId})
  }
  beforeEach(async () => {
    server = require("../../index");
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token=new User().generateAuthToken();
    movie=new Movie({
        _id:movieId,
        title:'12345',
        dailyRentalRate:2,
        genre:{name :'12345'},
        numberInStock :10
    });
    await movie.save();
     rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany();
  });
  it("should work!", async () => {
    token =null;
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });
  it("should return 401 if customer is not logged in ", async () => {
    token ='';
    const res=await exec();
    expect(res.status).toBe(401);
   });
  it("should return 400 if customerId is not provided", async () => {
      rental.customerId='';//elete.payload.customerId
    const res=await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId='';
    const res = await exec()
    expect(res.status).toBe(400)
  });
  it("should return 404 if no rentals found for the customer/movie", async () => {
    await rental.deleteMany({})
    const res = await exec()
    expect(res.status).toBe(404)
  });
  it("should return 400 if retal is already processed", async () => {
    rental.dateReturned= new Date();
    await rental.save()
    const res = await exec()
    expect(res.status).toBe(400)
  });
  it("should return 200 if have valid request", async () => {
    const res = await exec()
    expect(res.status).toBe(200)
  });
  it("should set the returnDate if input is valid", async () => {
    await exec()
    const rentalInDb=await Rental.findById(rental._id)
    expect(rentalInDb).toBeDefined();
    const diff=new Date()-new Date(rentalInDb.dateReturned);
    expect(diff).toBeLessThan(10*1000)
  });
  it("should set the rentalFee if input is valid", async () => {
    rental.dateOut=moment().add(-7,'days').toDate();
    await rental.save();
    await exec()
    const rentalInDb=await Rental.findById(rental._id)
    expect(rentalInDb.rentalFee).toBeDefined()
  });
  it("should increase the movie stock if input is valid", async () => {
    const res = await exec()
    const movieInDb=await Movie.findById(movieId)
    expect(movieInDb.numberInStock).toBeDefined()
  });
  it("should return the rental if input is valid", async () => {
    const res = await exec()
    const rentalInDb=await Rental.findById(rental._id)
    expect(res.body).toHaveProperty('dateOut');
    expect(res.body).toHaveProperty('dateReturned');
    expect(res.body).toHaveProperty('rentalFee');
    expect(res.body).toMatchObject('customer');
    expect(res.body).toHaveProperty('movie');
     // OR 
    // expect(Object.keys(rentalInDb)).toEqual(
    // expect.arrayContaining(['dateOut','dateReturned','rentalFee',
    // 'customer','movie']))
  });
});


