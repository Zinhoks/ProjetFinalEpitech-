const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new mongoose.Schema({
  user_id: {
    type: "String",
    required: true,
  },

  restaurant_id: {
    type: "String",
    required: true,
  },

  restaurant_name: {
    type: "String",
    required: true,
  },

  note: {
    type: "Number",
    required: true,
  },
});
const Note = mongoose.model("Note", NoteSchema);
module.exports = { Note };
