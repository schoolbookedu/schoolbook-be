const { body, param, header } = require("express-validator");

exports.UniversityCreationValidation = [
    body("name").trim().notEmpty().withMessage("University name is required"),
    body("pobox").trim().optional(),
    body("address").trim().optional(),
    body("country").trim().optional(),
    body("contactPhoneNumber").trim().optional(),
    body("contactEmail").trim().isEmail().optional(),
]

exports.UniversityUpdateValidation = []
