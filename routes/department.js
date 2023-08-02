const express = require("express");
const {
  getAllDepartment,
  getADepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department");
const { authenticate } = require("../middlewares/auth");
const { DepartmentCreationValidation, DepartmentUpdateValidation } = require("../validations/department.validation");

const departmentRouter = express.Router();

departmentRouter.get("/", getAllDepartment);
departmentRouter.get("/:id", getADepartment);
departmentRouter.post("/", authenticate,DepartmentCreationValidation, createDepartment);
departmentRouter.patch("/:id", authenticate, DepartmentUpdateValidation, updateDepartment);
departmentRouter.delete("/:id", authenticate, deleteDepartment);

module.exports = { departmentRouter };