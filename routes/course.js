const express = require("express");
const {
  getAllCourse,
  getACourse,
  createCourse,
  updateCourse,
  deleteCourse,
  createCourseMaterial
} = require("../controllers/course");
const { authenticate,authorize } = require("../middlewares/auth");
const { CourseCreationValidation, CourseUpdateValidation,CourseMaterialValidation } = require("../validations/course.validation");
const {userTypes} = require("../utils/userTypes")

const courseRouter = express.Router();

courseRouter.get("/", authenticate, getAllCourse);
courseRouter.get("/:id", authenticate, getACourse);
courseRouter.post("/", authenticate,authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]), CourseCreationValidation, createCourse);
courseRouter.post("/course-materials",  authenticate,authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]),CourseMaterialValidation, createCourseMaterial);
courseRouter.patch("/", CourseUpdateValidation, updateCourse);
courseRouter.delete("/:id", authenticate, deleteCourse);

module.exports = { courseRouter };