const { Types } = require("mongoose");
const { ObjectId } = Types;
const {
  getOne,
  getAll,
  updateDocument,
  deleteDocument,
  createDocument,
} = require("../utils/crudOperations");
const { DepartmentExcludedFields } = require("../utils/excludedFields");
const { validationCheck } = require("../utils/validationCheck");
const { responseText, statusCodes } = require("../utils/response");
const { removeFields } = require("../utils/handleExcludedFields");
const Department = require("../models/department");

exports.getAllDepartment = async (req, res, next) => {
  try {
    getAll(req, res, Department, DepartmentExcludedFields);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getADepartment = async (req, res, next) => {
  try {
    getOne(req, res, Department, DepartmentExcludedFields);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createDepartment = async (req, res, next) => {
  try {
    await validationCheck(req, res);

    removeFields(DepartmentExcludedFields, req.body);

    let created = await createDocument(req, res, Department);

    res.status(statusCodes[201]).json({
      statusCode: statusCodes[201],
      responseText: responseText.SUCCESS,
      data: created,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    await validationCheck(req, res);
    updateDocument(req, res, Department, "Department details updated successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    deleteDocument(req, res, Department);
  } catch (error) {
    console.log(error);
    next(error);
  }
};