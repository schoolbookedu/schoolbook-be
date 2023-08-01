const { Schema, model } = require("mongoose");
const { materialType } = require("../utils/materialType");
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  thumbnail: {
    type: String,
  },
  objectives: {
    type: String,
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  outlines: [
    {
      title: { type: String },
      materialTitle: { type: String },
      thumbnail: { type: String },
      materialType: { type: String, enum: materialType },
      // materialId: {
      //   type: Schema.Types.ObjectId,
      //   ref: "Material",
      //   required: true,
      // },
    },
  ],
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  follows: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Course = model("Course", courseSchema);
module.exports = Course;
