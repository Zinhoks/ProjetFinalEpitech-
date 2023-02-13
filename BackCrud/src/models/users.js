const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema ({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  favs: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false
  },
  updatedAt: {
    type: Date,
    required: false
  },
});

const Users = mongoose.model("Users", UserSchema)
module.exports = { Users };
