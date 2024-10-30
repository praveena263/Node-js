const {User} = require('../../model/user');
const {Genres} = require('../../model/geners');
const request= require('supertest');

describe('auth middleware',()=>{
    let server;
    let token;
    beforeEach(() => {
        server = require("../../index");
        token= new User().generateAuthToken()

      });
      afterEach(async() => {
        await Genres.deleteMany({})
        await server.close();
      });
    const exec=()=>{
        return request(server)
        .post('/api/generes')
        .set('x-auth-token',token)
        .send({ name:'genre1'})
    }
    it('should return 400 if token is invalid',async()=>{
        token='';
       const res=await exec();
       expect(res.status).toBe(400)
    })
    it('should return 401 if no token is provideed',async()=>{
        token='a';
       const res=await exec();
       expect(res.status).toBe(401)
    })
    it('should return 200 if no token is provideed',async()=>{
       const res=await exec();
       expect(res.status).toBe(200)
    })

})