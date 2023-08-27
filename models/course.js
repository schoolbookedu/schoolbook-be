const { Schema, model } = require("mongoose");
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  courseCode: {
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
      materialId: {
        type: Schema.Types.ObjectId,
        ref: "Material",
        required: true,
      },
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