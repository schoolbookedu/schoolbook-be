const { body, param, header } = require("express-validator");
const { materialType } = require("../utils/materialType");

exports.MaterialCreationValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("type").isIn(materialType).notEmpty().withMessage("type is required"),
  //body("mediaURL").trim().notEmpty().withMessage("mediaURL is required")
];

exports.MaterialUpdateValidation = [
  body("title").trim().notEmpty().withMessage("Title cannot be blank"),
];
