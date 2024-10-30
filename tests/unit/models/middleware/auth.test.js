const { User } = require("../../../../model/user");
const auth = require("../../../../middleware/auth");
const mongoose=require('mongoose');

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    const user={_id:new mongoose.Types.ObjectId()
        .toHexString(),
         isAdmin: true}
    const token = new User({ _id: user, isAdmin: true }).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});

// describe("auth middleware", () => {
//   it("should populate req.user with the payload of a valid JWT", () => {
//     // Create a new user with a specific _id
//     const userId = new mongoose.Types.ObjectId();
//     const user = {
//       _id: userId.toHexString(),
//       isAdmin: true
//     };
    
//     // Generate an authentication token for the user
//     const token = new User({ _id: userId, isAdmin: true }).generateAuthToken();

//     // Mock the request object with the token
//     const req = {
//       header: jest.fn().mockReturnValue(token),
//     };
//     const res = {};
//     const next = jest.fn();

//     // Call the auth middleware
//     auth(req, res, next);

//     // Expect req.user to match the user object
//     expect(req.user).toMatchObject(user);
//   });
// });