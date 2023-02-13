const mongoose = require("mongoose");

const CommandeSchema = new mongoose.Schema(
  {
    
    amount: {
      type: "string",
      required: false,
    },
    currency: {
      type: "string",
      required: false,
    },
    payment_method: {
      type: "string",
      required: false,
    },

    idUser: {
      type: "string",
      required: false,
    },
    dishinfo: {
      type: "array",
      required: false,
    },
    description: {
      type: "string",
      required: false,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commande", CommandeSchema);
