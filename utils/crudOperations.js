const User = require("../models/user");
const { excludedQueryFields } = require("./excludedFields");
const { responseText, statusCodes } = require("./response");
const { generateAccessToken } = require("./token");

exports.getAll = async (req, res, model, excludedFields = ["__v"], populate = { required: false }) => {
  try {
    let requestQueryObject = { ...req.query };

    excludedQueryFields.forEach(
      (element) => delete requestQueryObject[element]
    );

    let queryToString = JSON.stringify(requestQueryObject);

    queryToString = queryToString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );

    let query = model
      .find(JSON.parse(queryToString))
      .select(excludedFields.length ? `-${excludedFields.join(" -")}` : []);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v ");
    }

    //populate with realtionships
    if (populate.required) {
      if (populate.columns.length >= 1) {
        query = query.populate(populate.field, populate.columns)
      } else {
        query = query.populate(populate.field)
      }
    }

    const page = req.query.page * 1 || 1;
    const pageSize = req.query.pageSize * 1 || 20;
    const skip = (page - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    let numberOfDocument = await model.countDocuments();
    if (req.query.page) {
      if (skip >= numberOfDocument) {
        return res.status(404).json({ msg: "This page does not exits" });
      }
    }

    const result = await query;

    res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: { total: result.length, resource: result },
    });
  } catch (error) {
    console.log(error);
    return res.status(statusCodes[400]).json({
      statusCode: statusCodes[400],
      responseText: responseText.FAIL,
      errors: [{ msg: error.message || "something went wrong" }],
    });
  }
};

exports.getOne = async (req, res, model, excludedFields = ["__v"], populate = { required: false }) => {
  try {
    let resource = model
      .findById(req.params.id)
      .select(excludedFields.length ? `-${excludedFields.join(" -")}` : []);


    if (populate.required) {
      if (populate.columns.length >= 1) {
        resource = resource.populate(populate.field, populate.columns)
      } else {
        resource = resource.populate(populate.field)
      }
    }
    resource = await resource;
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
    return res.status(statusCodes[400]).json({
      statusCode: statusCodes[400],
      responseText: responseText.FAIL,
      errors: [{ msg: error.message }],
    });
  }
};

exports.updateDocument = async (req, res, model, msg = "Successful") => {
  try {
    const resource = await model.findById(req.params.id);
    if (!resource) {
      res.status(statusCodes[404]).json({
        statusCode: statusCodes[404],
        responseText: responseText.FAIL,
        errors: [{ msg: "Resource not found" }],
      });
    }

    const updatedResoure = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedResoure.password) {
      updatedResoure.password = "*****"
    }

    return res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: { msg, resource: updatedResoure },
    });
  } catch (error) {
    console.log(error);
    return res.status(statusCodes[400]).json({
      statusCode: statusCodes[400],
      responseText: responseText.FAIL,
      errors: [{ msg: error.message }],
    });
  }
};

exports.deleteDocument = async (req, res, model) => {
  try {
    const resource = await model.findById(req.params.id);
    if (!resource) {
      return res.status(statusCodes[404]).json({
        statusCode: statusCodes[404],
        responseText: responseText.FAIL,
        errors: [{ msg: "Resource not found" }],
      });
    }
    await model.findByIdAndRemove(req.params.id);
    return res.status(statusCodes[200]).json({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: {
        msg: "Resource deleted successfully",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(statusCodes[400]).json({
      statusCode: statusCodes[400],
      responseText: responseText.FAIL,
      errors: [{ msg: error.message }],
    });
  }
};

exports.createDocument = async (
  req,
  res,
  model,
  extra = {},
  msg = "Successful"
) => {
  try {
    const createdResource = await model.create(req.body);

    let resource = { ...createdResource._doc };

    if (resource.hasOwnProperty("password")) {
      delete resource.password;
      const payLoad = {
        user: {
          id: resource._id,
        },
      };
      let accessToken = await generateAccessToken(payLoad);
      extra.accessToken = accessToken;
    }
    return { msg, resource, extra };
  } catch (error) {
    let customError = {
      statusCode: error.statusCode || statusCodes[500],
      msg: error.message || "Something went wrong",
    };

    if (error.code && error.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
        error.keyValue
      )}, please choose another value`;
      customError.statusCode = statusCodes[400];
    }
    return res.status(customError.statusCode).json({
      statusCode: customError.statusCode,
      responseText: responseText.FAIL,
      errors: [{ msg: customError.msg }],
    });
  }
};