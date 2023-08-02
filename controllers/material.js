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
        req.body.userId= req.user.id

        const  mediaURLuploaded = await uploadFile(req.body.mediaURL,"mediaURL","course-material");
        req.body.mediaURL = mediaURLuploaded;

        let created = await createDocument(req, res, Material);
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

  exports.getAllMaterial = async (req, res, next) => {
    try {
      getAll(req, res, Material, );
    
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  exports.getAMaterial = async (req, res, next) => {
    try {
      getOne(req, res, Material, );
    
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  exports.getMyMaterial = async (req, res, next) => {
    try {
      req.query.userId= req.user.id
      getAll(req, res, Material, );
    
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  exports.updateMaterial = async (req, res, next) => {
    try {
        await validationCheck(req, res);
        updateDocument(req, res, Material, "Material details updated successfully");
    
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


 
  
  
  
  
  
  
  