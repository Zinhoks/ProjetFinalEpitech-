const userModel = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { signin } = require('../controllers/userController.js');

describe('signin', () => {
  it('return token and valid succes info', async () => {
    const existingUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('password', 8),
    };
    userModel.findOne = jest.fn().mockResolvedValue(existingUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('token');

    const req = {
      body: {
        email: 'user@user.fr',
        password: '123456789',
      },
    };
    const res = {
      status: jest.fn().mockReturnValue({
        json: jest.fn().mockReturnValue({}),
      }),
    };

    await signin(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'user@user.fr' });
    expect(bcrypt.compare).toHaveBeenCalledWith('123456789', existingUser.password);
    expect(jwt.sign).toHaveBeenCalledWith({ email: existingUser.email, id: existingUser._id }, 'NOTESAPI');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status().json).toHaveBeenCalledWith({ user: existingUser, token: 'token' });
  });

  
})