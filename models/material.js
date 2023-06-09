const { Schema, model } = require("mongoose");
const { materialType } = require("../utils/materialType");
const materialSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: materialType,
  },
  mediaURL: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Material = model("Material", materialSchema);
module.exports = Material;
