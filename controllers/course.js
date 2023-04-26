const { Types } = require("mongoose");
const { ObjectId } = Types;
const {
  getOne,
  getAll,
  updateDocument,
  deleteDocument,
  createDocument,
} = require("../utils/crudOperations");
const { CourseExcludedFields } = require("../utils/excludedFields");
const { responseText, statusCodes } = require("../utils/response");
const { removeFields } = require("../utils/handleExcludedFields");
const { validationCheck } = require("../utils/validationCheck");
const Course = require("../models/course");


exports.getAllCourse = async (req, res, next) => {
  try {
    getAll(req, res, Course, CourseExcludedFields);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getACourse = async (req, res, next) => {
  try {
    getOne(req, res, Course, CourseExcludedFields);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    await validationCheck(req, res);

    removeFields(CourseExcludedFields, req.body);

    let created = await createDocument(req, res, Course);

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

exports.updateCourse = async (req, res, next) => {
  try {
    await validationCheck(req, res);
    updateDocument(req, res, Course, "Course details updated successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    deleteDocument(req, res, Course);
  } catch (error) {
    console.log(error);
    next(error);
  }
};