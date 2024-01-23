const { Schema, model } = require("mongoose");

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  materials: [
    {
      materialId: {
        type: Schema.Types.ObjectId,
        ref: "Material",
      },
    },
  ],
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Module = model("Module", moduleSchema);
module.exports = Module;
