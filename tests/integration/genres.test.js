const request = require("supertest");
const { Genres } = require("../../model/geners");
const { User } = require("../../model/user");
const mongoose = require("mongoose");
const express = require("express");

// = require("../../index");
describe("/api/generes", () => {
  let server;
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
  });
  describe("GET /", () => {
    it("Should return all genres", async () => {
      const res = await request(server).get("/api/generes");
      expect(res.status).toEqual(200);
    });
  });
  describe("GET /", () => {
    it("Should return a genre if valid id is passed", async () => {
      const genre = new Genres({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/generes/" + genre._id);

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('name');
    });
    it("Should return 404 if invalid genre id exists", async () => {
      const genre = new Genres({ name: "genre1" });
      await genre.save();
      const objectId = new mongoose.Types.ObjectId();
      const id = objectId.toHexString();

      const res = await request(server).get("/api/generes/1" + id);

      expect(res.status).toEqual(404);
      expect(res.body).toHaveProperty(genre);
    });
  });
  describe("post /", () => {
    //Define the happy path and in each test,we change
    // one parameter that clearly aligns with the name of the test

    //mosh teschnique
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/generes")
        .set("x-auth-token", token)
        .send({ name }); // or .send({name: name});
    };
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });
    it("should return 401 if the client is not loged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is lessthan 5 characters", async () => {
      // const token =new User().genrerateAuthToken();
      // const res= await request(server)
      // .post('/api/generes')
      // .set('x-auth-token',token)
      // .send({name:'1234'})
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(51).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should save the genre if it is valid", async () => {
      await exec();
      const genre = await Genres.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
    it("should return  the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", name);
    });
  });
});
