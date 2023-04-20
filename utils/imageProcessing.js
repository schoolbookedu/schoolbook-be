const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, "public/img/school-book-images/");
    } else {
      cb(new Error("Not an image"), false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const filterFileType = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image"), false);
  }
};
exports.upload = multer({ storage: multerStorage, fileFilter: filterFileType });
exports.cloudinary = cloudinary;

exports.uploadImage = async (img, field, folder) => {
  let imageURL = "";

  await cloudinary.uploader.upload(
    img,
    {
      public_id: `${folder}/${field}-${Date.now()}`,
    },
    (error, result) => {
      if (error) {
        console.log(`Error uploading ${field} to cloudinary`);
      } else {
        imageURL = result.secure_url;
        //return result.secure_url;
      }
    }
  );

  return imageURL;
};