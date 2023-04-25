const { body, param, header } = require("express-validator");

exports.DepartmentCreationValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("faculty").optional({checkFalsy: true}),
];

exports.DepartmentUpdateValidation = [
  body("name").trim().optional({ checkFalsy }),
  body("faculty").trim().optional({ checkFalsy }),
];
