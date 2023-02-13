const request = require("supertest");
const app = require("../index.js");
const userModel = require("../models/user.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

jest.mock("jsonwebtoken");
jest.mock("../models/user.js");



describe("signup", () => {
  const user = {
    username: "testuser",
    email: "test@example.com",
    password: "testpassword",
    status: "user",
    address: "11 test adress",
  };

  beforeEach(() => {
    userModel.findOne.mockReset();
    userModel.create.mockReset();
    jwt.sign.mockReset();
  });

  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://admin:admin@clusterilyes.teutkqo.mongodb.net/Epeat?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  it("201 successful", async () => {
    const user = {
        username: "testuserrr",
        email: "test@example.com",
        password: "testpassword",
        status: "user",
        address: "11 test adress",
      };

    userModel.findOne.mockReturnValue(Promise.resolve(null));
    userModel.create.mockReturnValue(
      Promise.resolve({ ...user })
    );
    const res = await request(app).post("/users/signup").send(user);
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    
  });
});
