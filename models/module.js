const { Schema, model } = require("mongoose");

const CourseModuleSchema = new Schema({
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

const CourseModule = model("CourseModule", CourseModuleSchema);
module.exports = CourseModule;
