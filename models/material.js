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
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: "CourseModule",
    required: true,
  },
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

const Material = model("Material", materialSchema);
module.exports = Material;
