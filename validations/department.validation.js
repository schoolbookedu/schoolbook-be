const { body, param, header } = require("express-validator");

exports.DepartmentCreationValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("faculty").optional({checkFalsy: true}),
];

exports.DepartmentUpdateValidation = [
  body("name").trim().optional({ checkFalsy: true }),
  body("faculty").trim().optional({ checkFalsy: true }),
];