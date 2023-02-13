const mongoose = require("mongoose");

const DishesSchema = new mongoose.Schema({
  Dish_Name: {
    type: "String",
    required: true,
  },

  Dish_Price: {
    type: "Number",
    required: true,
  },

  Restaurant_ID: {
    type: "String",
    required: true,
  },

  Restaurant_List: {
    type: "Object",
    required: false,
  },
});
const Dish = mongoose.model("Dish", DishesSchema);
module.exports = { Dish };
