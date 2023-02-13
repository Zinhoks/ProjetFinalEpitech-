const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  path: {
    type: String,
    required: false,
  }
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = { Restaurant };
