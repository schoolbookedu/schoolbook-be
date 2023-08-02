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
    // if (file.mimetype.startsWith("image")) {
    //   cb(null, "public/img/school-book-images/");
    // } else {
    //   cb(new Error("Not an image"), false);
    // }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const filterFileType = (req, file, cb) => {
  const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".gif",];
  const allowedVideoExtensions = ["flv","mov","mkv","mp4","webm","mpd","ogv"]

  const allowedExtensions=[...allowedImageExtensions,...allowedVideoExtensions];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowedExtensions.join(",")} extensions are allowed`), false);
  }
};
exports.upload = multer({ storage: multerStorage, fileFilter: filterFileType });
exports.cloudinary = cloudinary;

exports.uploadFile = async (img, field, folder) => {
  let imageURL = "";

  const tempDirectory = path.join(__dirname, "../tmp");
  const tempFilePath = path.join(tempDirectory, `${field}-${Date.now()}`);

  // Create the 'tmp' directory if it doesn't exist
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory);
  }

  // Save the file from the buffer to the temporary location
  await writeFileAsync(tempFilePath, file.buffer);

  await cloudinary.uploader.upload(
    tempFilePath,
    {
      public_id: `${folder}/${field}-${Date.now()}`, resource_type:"auto"
    },
    (error, result) => {
      if (error) {
        console.log(`Error uploading ${field} to cloudinary`);
      } else {
        imageURL = result.secure_url;
      }
    }
  );

  // Delete the temporary file
  fs.unlinkSync(tempFilePath);

  return imageURL;
};
