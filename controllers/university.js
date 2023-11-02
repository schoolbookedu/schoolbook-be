const { Types } = require("mongoose");
const { ObjectId } = Types;
const {
  getOne,
  getAll,
  updateDocument,
  deleteDocument,
  createDocument,
} = require("../utils/crudOperations");
const { UniversityExcludedFields } = require("../utils/excludedFields");
const { validationCheck } = require("../utils/validationCheck");
const { responseText, statusCodes } = require("../utils/response");
const { removeFields } = require("../utils/handleExcludedFields");
const University = require("../models/university");

exports.getAllUniversity = async (req, res, next) => {
  try {
    getAll(req, res, University, UniversityExcludedFields);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getAUniversity = async (req, res, next) => {
  try {
    getOne(req, res, University, UniversityExcludedFields);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createUniversity = async (req, res, next) => {
  try {
    await validationCheck(req, res);

    removeFields(UniversityExcludedFields, req.body);

    let created = await createDocument(req, res, University);

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

exports.updateUniversity = async (req, res, next) => {
  try {
    await validationCheck(req, res);
    updateDocument(
      req,
      res,
      University,
      "University details updated successfully"
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteUniversity = async (req, res, next) => {
  try {
    deleteDocument(req, res, University);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
