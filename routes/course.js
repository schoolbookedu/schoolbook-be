const express = require("express");
const {
  getAllCourse,
  getACourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");
const { authenticate } = require("../middlewares/auth");
const { CourseCreationValidation, CourseUpdateValidation } = require("../validations/course.validation");

const courseRouter = express.Router();

courseRouter.get("/", authenticate, getAllCourse);
courseRouter.get("/:id", authenticate, getACourse);
courseRouter.post("/", CourseCreationValidation, createCourse);
courseRouter.patch("/", CourseUpdateValidation, updateCourse);
courseRouter.delete("/:id", authenticate, deleteCourse);

module.exports = { courseRouter };
