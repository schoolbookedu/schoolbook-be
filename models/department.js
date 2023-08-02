const { Schema, model } = require("mongoose");

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  faculty: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Department = model("Department", departmentSchema);
module.exports = Department;