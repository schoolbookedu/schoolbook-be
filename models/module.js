const { Schema, model } = require("mongoose");

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  materials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Material",
    },
  ],
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Module = model("Module", moduleSchema);
module.exports = Module;
