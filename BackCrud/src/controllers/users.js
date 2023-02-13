const { Users } = require("../models/users");

const getUsers = () => {
  res.send("GET API");
};

const findUser = () => {};

const createUser = (req, res) => {
  // const newUser = {
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   address: req.body.address,
  // };
  // Users.push(newUser);
  // res.status(201).json(newUser);
  // res.send("Post API");
};

const updateUser = () => {};

const deleteUser = () => {};

module.exports = {
  getUsers,
  findUser,
  createUser,
  updateUser,
  deleteUser,
};
