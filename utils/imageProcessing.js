const fs = require("fs");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multerStorage = multer.memoryStorage({
  destination: function (req, file, cb) {
   cb(null, "public/media/"); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const filterFileType = (req, file, cb) => {
  const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".gif",];
  const allowedVideoExtensions = ["flv","mov","mkv","mp4","webm","mpd","ogv"]
  const allowedDocumentExtensions = ["pdf","docx","txt","rtf","doc"]

  const allowedExtensions=[...allowedImageExtensions,...allowedVideoExtensions,...allowedDocumentExtensions];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowedExtensions.join(",")} extensions are allowed`), false);
  }
};
exports.upload = multer({ storage: multerStorage, fileFilter: filterFileType });
exports.cloudinary = cloudinary;

exports.uploadFile = async (req, field, folder) => {
  let imageURL = "";

  if(req.file){

    await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: `${folder}/${field}-${Date.now()}`,
      },
      (error, result) => {
        if (error) {
          console.log(`Error uploading ${field} to cloudinary`);
        } else {
          imageURL = result.secure_url;
        }
      }
    );


  }else if(req.body.imageURL){

    await cloudinary.uploader.upload(
      req.body.imageURL,
      {
        public_id: `${folder}/${field}-${Date.now()}`,
      },
      (error, result) => {
        if (error) {
          console.log(`Error uploading ${field} to cloudinary`);
        } else {
          imageURL = result.secure_url;
        }
      }
    );

  }

  return imageURL;
};
