const {
    getOne,
    getAll,
    updateDocument,
    deleteDocument,
    createDocument,
  } = require("../utils/crudOperations");
  
  const { responseText, statusCodes } = require("../utils/response");
  const {cloudinary, upload, uploadFile}= require("../utils/imageProcessing")
  const { removeFields } = require("../utils/handleExcludedFields");
  const { validationCheck } = require("../utils/validationCheck");
  const Material = require("../models/material");
  
  
  exports.createMaterial = async (req, res, next) => {
    try {
        await validationCheck(req, res);
    
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  
  
  
  
  
  
  