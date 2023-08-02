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
const {uploadFile}= require("../utils/imageProcessing")


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
    if(req.body.thumbnail){
       const thumbnailURL = await uploadFile(req.body.thumbnail,"thumbnail","course_thumbnail")
       req.body.thumbnail=thumbnailURL
    }
    req.body.tutor= req.user.id
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

exports.createCourseMaterial=async(req,res, next)=>{
  try {
    await validationCheck(req, res);

    removeFields(CourseExcludedFields, req.body);
    req.body.userId= req.user.id
    const course = Course.findById(req.body.courseId);
    if(!course){
      return res.status(statusCodes[400]).json({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg:  "Course not found" }],
      });
    }

    course.outlines.push(req.body)
    await course.save()
  
    res.status(statusCodes[201]).json({
      statusCode: statusCodes[201],
      responseText: responseText.SUCCESS,
      data: course,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }

}