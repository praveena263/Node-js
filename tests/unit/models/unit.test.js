const {User}= require('../../../model/user')
const jwt=require('jsonwebtoken');
const config=require('config');
const mongoose=require('mongoose')

describe('user.generateAuthToken',()=>{
    it('should return a valid JWT',()=>{
        const payload={
            _id: new mongoose.Types.ObjectId()
            .toHexString(),
            isAdmin : true
        };
        const user= new User(payload)
        const token=user.generateAuthToken();
        expect(token).toBeTruthy();
        const decoded=jwt.verify(token,config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload)
    })
})


// describe('user.generateAuthToken', () => {
//     it('should return a valid JWT', () => {
//         // Generate a new ObjectId for the user
//         const userId = new mongoose.Types.ObjectId();
        
//         // Create a new User with the generated ObjectId and isAdmin set to true
//         const user = new User({_id: userId, isAdmin: true}); // Set isAdmin to true

//         // Generate JWT token
//         const token = user.generateAuthToken();

//         // Decode the token
//         const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

//         // Define the expected payload
//         const payload = {_id: userId.toHexString(), isAdmin: true};

//         // Expect decoded token to match the payload
//         expect(decoded).toMatchObject(payload);
//     });
// });



