const { body, param, header } = require("express-validator");
const { materialType } = require("../utils/materialType");

exports.CourseCreationValidation = [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("courseCode").trim().notEmpty().withMessage("courseCode is required"),
  body("objectives")
    .isString()
    .withMessage("objectives must be a string")
    .optional(),
];
exports.CourseModuleMaterialValidation = [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("materialTitle")
    .trim()
    .notEmpty()
    .withMessage("materialTitle is required"),
  body("materialType")
    .trim()
    .notEmpty()
    .isIn(materialType)
    .withMessage("materialType is required"),
  body("moduleId").trim().notEmpty().withMessage("moduleId is required"),
  body("courseId").trim().notEmpty().withMessage("courseId is required"),
];

exports.CourseModuleValidation = [
  body("title").trim().notEmpty().withMessage("Module title is required"),
  body("courseId").trim().notEmpty().withMessage("CourseId is required"),
];

exports.enrollmentValidation = [
  body("courseId").trim().notEmpty().withMessage("courseId is required"),
];
exports.CourseUpdateValidation = [];
