const express = require("express");
const {
  createMaterial,
  getAllMaterial,
  updateMaterial,
  deleteMaterial
} = require("../controllers/material");
const { authenticate, authorize } = require("../middlewares/auth");
const {MaterialCreationValidation } = require("../validations/material.validation");
const {userTypes}= require("../utils/userTypes")

const materialRouter = express.Router();

materialRouter.get("/", authenticate,authorize([ userTypes.Admin]), getAllMaterial);
materialRouter.get("/my-material", authenticate,authorize([ userTypes.Instructor, userTypes.Developer, userTypes.Admin]), getAllMaterial);
materialRouter.post("/", authenticate,authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]), MaterialCreationValidation, createMaterial);
materialRouter.patch("/", authenticate,authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]), MaterialCreationValidation, updateMaterial);
materialRouter.delete("/", authenticate,authorize([userTypes.Instructor, userTypes.Developer, userTypes.Admin]), MaterialCreationValidation, deleteMaterial);



module.exports = { materialRouter };
