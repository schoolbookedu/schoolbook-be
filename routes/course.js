const express = require("express");
const {
  getAllCourse,
  getACourse,
  createCourse,
  updateCourse,
  deleteCourse,
  createCourseMaterial,
  getTutorCourses,
  enrollToCourse,
  getStudentCourse,
  createCourseModule,
} = require("../controllers/course");
const { authenticate, authorize } = require("../middlewares/auth");
const {
  CourseCreationValidation,
  CourseUpdateValidation,
  CourseMaterialValidation,
  enrollmentValidation,
  CourseModuleValidation,
} = require("../validations/course.validation");
const { userTypes } = require("../utils/userTypes");

const courseRouter = express.Router();

courseRouter.get("/", authenticate, getAllCourse);
courseRouter.get("/:id", authenticate, getACourse);
courseRouter.get("/tutor/my-courses", authenticate, getTutorCourses);
courseRouter.get(
  "/student/my-courses",
  authenticate,
  authorize([userTypes.Student]),
  getStudentCourse
);
courseRouter.post(
  "/enroll",
  authenticate,
  authorize([userTypes.Student]),
  enrollmentValidation,
  enrollToCourse
);
courseRouter.post(
  "/",
  authenticate,
  authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]),
  CourseCreationValidation,
  createCourse
);
courseRouter.post(
  "/course-module-materials",
  authenticate,
  authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]),
  CourseModuleValidation,
  createCourseModule
);
courseRouter.post(
  "/course-modules",
  authenticate,
  authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]),
  CourseMaterialValidation,
  createCourseMaterial
);
courseRouter.patch("/:id", CourseUpdateValidation, updateCourse);
courseRouter.delete("/:id", authenticate, deleteCourse);

module.exports = { courseRouter };
