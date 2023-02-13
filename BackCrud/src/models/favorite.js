const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteSchema = new mongoose.Schema({

  userID:{
    type:"String",
    required: true,
  },

  Restaurant_ID: {
    type: "String",
    required: true,
  },

  Restaurant_Name: {
    type: "String",
    required: true,
  },
});
const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = { Favorite };
