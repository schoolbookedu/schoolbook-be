const { body, param, header } = require("express-validator");

exports.UniversityCreationValidation = [
  body("name").trim().notEmpty().withMessage("University name is required"),
  body("pobox").trim().optional({ checkFalsy: true }),
  body("address").trim().optional({ checkFalsy: true }),
  body("country").trim().optional({ checkFalsy: true }),
  body("contactPhoneNumber").trim().optional({ checkFalsy: true }),
  body("contactEmail").trim().isEmail().optional({ checkFalsy: true }),
];

exports.UniversityUpdateValidation = [];
