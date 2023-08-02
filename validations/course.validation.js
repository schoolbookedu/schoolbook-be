const { body, param, header } = require("express-validator");
const { materialType } = require("../utils/materialType");

exports.CourseCreationValidation =  [
    body("title").trim().notEmpty().withMessage("title is required"),
    body("thumbnail").isString().withMessage("thumbnail must be a string").optional(),
    body("objectives").isString().withMessage("objectives must be a string").optional(),
    // body("outlines").custom(async (value) => {
    //     if(value !== undefined && value.length > 0 ) {
    //         value.forEach(outline => {
    //             if (!outline.materialType.isIn(materialType)) {
    //                 throw new Error('Invalid material type')
    //             }
    //         })
    //     }
    // })
]

exports.CourseUpdateValidation = []