const {
  getOne,
  getAll,
  updateDocument,
  deleteDocument,
  createDocument,
} = require("../utils/crudOperations");

const { responseText, statusCodes } = require("../utils/response");
const { uploadFile } = require("../utils/imageProcessing");
const { removeFields } = require("../utils/handleExcludedFields");
const { validationCheck } = require("../utils/validationCheck");
const Material = require("../models/material");
const Course = require("../models/course");
const Module = require("../models/module");

exports.createMaterial = async (req, res, next) => {
  try {
    await validationCheck(req, res);

    removeFields(CourseExcludedFields, req.body);
    req.body.userId = req.user.id;
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(statusCodes[400]).json({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: "Course not found" }],
      });
    }
    const courseModule = await Module.findOne({
      _id: req.body.moduleId,
      courseId: req.body.courseId,
    });
    if (!courseModule) {
      return res.status(statusCodes[400]).json({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: `module not found for ${course.title} course` }],
      });
    }

    const mediaURLuploaded = await uploadFile(
      req,
      "mediaURL",
      "course-material"
    );
    req.body.mediaURL = mediaURLuploaded;

    let createdMaterial = await createDocument(req, res, Material);
    courseModule.materials.push(createdMaterial.resource._id);
    await courseModule.save();
    res.status(statusCodes[201]).json({
      statusCode: statusCodes[201],
      responseText: responseText.SUCCESS,
      data: created,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

exports.getAllMaterial = async (req, res, next) => {
  try {
    getAll(req, res, Material);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getAMaterial = async (req, res, next) => {
  try {
    getOne(req, res, Material);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getMyMaterial = async (req, res, next) => {
  try {
    req.query.userId = req.user.id;
    getAll(req, res, Material);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateMaterial = async (req, res, next) => {
  try {
    await validationCheck(req, res);
    updateDocument(req, res, Material, "Material details updated successfully"); //update requires all fields, one to look into
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.deleteMaterial = async (req, res, next) => {
  try {
    deleteDocument(req, res, Material);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
