const { Types, isValidObjectId } = require("mongoose");
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
const CourseModule = require("../models/module");
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
    const courses = await Course.find({})
      .populate("modules")
      .populate("tutor", "fullName email avatar country phoneNumber gender");
    res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: {
        msg: "Courses fetched successfully",
        resource: courses,
        extra: {},
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getModuleMaterials = async (req, res, next) => {
  try {
    const moduleMaterials = await CourseModule.findById(
      req.params.moduleId
    ).populate("materials");

    res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: {
        msg: "Module materials successfully fetched",
        resource: moduleMaterials,
        extra: {},
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getCourseModules = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const courseModules = await Course.findById(courseId).populate("modules");
    res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: {
        msg: "Course modules successfully fetched",
        resource: courseModules,
        extra: {},
      },
    });
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
    if (!isValidObjectId(req.params.id)) {
      return res.status(statusCodes[400]).json({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: "Id passed not a valid objectId" }],
      });
    }

    const resource = await Course.findById(req.params.id)
      .populate("modules")
      .populate("tutor", "fullName email avatar country phoneNumber gender");

    if (!resource) {
      return res.status(statusCodes[404]).json({
        statusCode: statusCodes[404],
        responseText: responseText.FAIL,
        errors: [{ msg: "Resource not found" }],
      });
    }
    res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: { resource },
    });
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

exports.createCourseModule = async (req, res, next) => {
  try {
    await validationCheck(req, res);
    req.body.tutor = req.user.id;
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(statusCodes[400]).json({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: "Course not found" }],
      });
    }
    let createdModule = await createDocument(req, res, CourseModule);
    course.modules.push(createdModule.resource._id);

    await course.save();
    res.status(statusCodes[201]).json({
      statusCode: statusCodes[201],
      responseText: responseText.SUCCESS,
      data: createdModule,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createCourseModuleMaterial = async (req, res, next) => {
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
    const courseModule = await CourseModule.findOne({
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
