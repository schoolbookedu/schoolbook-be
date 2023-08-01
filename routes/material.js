const express = require("express");
const {
  createMaterial,
} = require("../controllers/material");
const { authenticate } = require("../middlewares/auth");
const {MaterialCreationValidation } = require("../validations/material.validation");

const materialRouter = express.Router();

materialRouter.post("/", authenticate, MaterialCreationValidation, createMaterial);



module.exports = { courseRouter };
