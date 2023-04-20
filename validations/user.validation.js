const { body, param, header } = require("express-validator");
const { gender } = require("../utils/gender");

exports.UserCreationValidation = [
  body("fullName").trim().notEmpty().withMessage("fullName is required"),
  body("country").trim().notEmpty().withMessage("country is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email not valid"),
  body("phoneNumber").trim().notEmpty().withMessage("phoneNumber is required"),
  body("password").trim().notEmpty().withMessage("password is required"),
  body("gender").isIn(gender).notEmpty().withMessage("gender is required"),
];

exports.UserUpdateValidation = [];
