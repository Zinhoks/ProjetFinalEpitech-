const mongoose = require("mongoose");

const CommandeSchema = new mongoose.Schema ({
  amount: {
    type: String,
    required: true,
  },

  currency: {
    type: String,
    required: true,
  },
  
  payment_method: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
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

const Commandes = mongoose.model("Commandes", CommandeSchema)

module.exports = { Commandes };
