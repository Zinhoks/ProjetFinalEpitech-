const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    token: {
      type: "string",
      required: false,
    },
    status: {
      type: "string",
      required: false,
    },
    address: {
      type: "string",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
