const { Schema, model } = require("mongoose");

const universitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  pobox: {
    type: String,
  },
  address: {
    type: String,
  },

  country: {
    type: String,
  },

  contactPhoneNumber: {
    type: String,
  },
  contactEmail: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const University = model("University", universitySchema);
module.exports = University;