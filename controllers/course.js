const { Types } = require("mongoose");
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
const User = require("../models/user");
const { uploadFile } = require("../utils/imageProcessing");

// const { Types } = Schema;
// const { ObjectId } = Types;

const populate = {
  required: true,
  field: "tutor",
  columns: "fullName email avatar gender",
};
exports.getAllCourse = async (req, res, next) => {
  try {
    getAll(req, res, Course, CourseExcludedFields, populate);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getTutorCourses = async (req, res, next) => {
  try {
    req.query.tutor = req.user.id;
    getAll(req, res, Course, CourseExcludedFields, populate);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getStudentCourse = async (req, res, next) => {
  try {
    const userCourses = await User.findById(req.user.id)
      .populate({
        path: "myCourses",
        populate: {
          path: "tutor",
          model: "User",
          select: "fullName phoneNumber gender email avatar",
        },
      })
      .populate({
        path: "myCourses",
        populate: {
          path: "outlines.materialId",
          model: "Material", // The model to use for population
        },
      })
      .select("-password -passwordResetToken -passwordResetTokenExpires");

    let myCourses = userCourses.myCourses;

    const updatedCourses = myCourses.map((course) => {
      const updatedCourse = { ...course._doc };
      delete updatedCourse.enrollee;
      return updatedCourse;
    });
    res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: {
        msg: "My courses",
        resource: updatedCourses,
        extra: {},
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getACourse = async (req, res, next) => {
  try {
    getOne(req, res, Course, CourseExcludedFields, populate);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    await validationCheck(req, res);

    removeFields(CourseExcludedFields, req.body);
    if (req.body.thumbnail) {
      const thumbnailURL = await uploadFile(
        req,
        "thumbnail",
        "course_thumbnail"
      );
      req.body.thumbnail = thumbnailURL;
    }
    req.body.tutor = req.user.id;
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

exports.enrollToCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(statusCodes[404]).json({
        statusCode: statusCodes[404],
        responseText: responseText.FAIL,
        errors: [{ msg: "Invalid course Id" }],
      });
    }

    const courseIdConverted = Types.ObjectId(courseId);
    const userIdConverted = Types.ObjectId(userId);

    //check if user already enrolled in the course

    let isEnrolled = user.myCourses.filter(
      (id) => id.toString() === courseId.toString()
    );
    if (isEnrolled.length) {
      return res.status(statusCodes[404]).json({
        statusCode: statusCodes[404],
        responseText: responseText.FAIL,
        errors: [{ msg: "You already enrolled for this course" }],
      });
    }

    user.myCourses = [...user.myCourses, courseIdConverted];
    await user.save();

    course.enrollee = [...course.enrollee, userIdConverted];
    course.enrollmentCount = course.enrollmentCount + 1;
    await course.save();
    const enrolledCourse = { ...course._doc };
    delete enrolledCourse.enrollee;
    delete enrolledCourse.enrollmentCount;
    res.status(statusCodes[201]).json({
      statusCode: statusCodes[201],
      responseText: responseText.SUCCESS,
      data: {
        msg: "Enrollment successful",
        resource: enrolledCourse,
        extra: {},
      },
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

exports.createCourseMaterial = async (req, res, next) => {
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

    course.outlines.push(req.body);
    await course.save();

    res.status(statusCodes[201]).json({
      statusCode: statusCodes[201],
      responseText: responseText.SUCCESS,
      data: course,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
