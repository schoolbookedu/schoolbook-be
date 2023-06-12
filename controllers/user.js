const { Types } = require("mongoose");
const { ObjectId } = Types;
const {
  getOne,
  getAll,
  updateDocument,
  deleteDocument,
  createDocument,
} = require("../utils/crudOperations");
const {
  UserExcludedFields,
  UserCreateExcludedFields,
  UserGetExcludedFields,
  UserUpdateExcludedFields,
} = require("../utils/excludedFields");
const { responseText, statusCodes } = require("../utils/response");
const {
  decryptPassword,
  hashUserPassword,
} = require("../utils/passwordManipulation");
const {
  generateAccessToken,
  generateVerificationToken,
} = require("../utils/token");
const { removeFields } = require("../utils/handleExcludedFields");
const {
  publishToRabbitMQ,
  consumeFromRabbitMQ,
} = require("../utils/mailing");
const { validationCheck } = require("../utils/validationCheck");
const { userTypes } = require("../utils/userTypes");
const { uploadImage } = require("../utils/imageProcessing");
const { logs } = require("../utils/log");
const ejs = require("ejs");

const User = require("../models/user");

exports.getAllUser = async (req, res) => {
  try {
    getAll(req, res, User, UserGetExcludedFields);
  } catch (error) {
    console.log(error);
  }
};
exports.getAUser = async (req, res) => {
  try {
    getOne(req, res, User, UserGetExcludedFields);
  } catch (error) {
    console.log(error);
  }
};
exports.createUser = async (req, res) => {
  try {
    await validationCheck(req, res);

    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(statusCodes[400]).json({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: `Email ${req.body.email} already exist` }],
      });
    }

    removeFields(UserCreateExcludedFields, req.body);

    const userVerificationToken = await generateVerificationToken();

    let hashedPassword = await hashUserPassword(req.body.password);
    req.body.password = hashedPassword;

    const { msg, resource, extra } = await createDocument(req, res, User);

    await User.findOneAndUpdate(
      { email: req.body.email },
    );

    const data = {
      fullName: req.body.fullName,
      magicLink: `${process.env.BASE_URL}/api/v1/users/profile/verify?verificationToken=${userVerificationToken}`,
    };

    ejs.renderFile(
      "./views/welcomeEmail.ejs",
      data,
      async (err, renderedHtml) => {
        if (err) {
          console.error("Error rendering template:", err);
          return;
        }

        const mailOptions = {
          to: req.body.email,
          from: process.env.SENDER_EMAIL, 
          subject: "Verify Your SchoolBook Account",
        };
      //   // Add the HTML content to the mail options
        mailOptions.html = renderedHtml;

        // Send the email
        await publishToRabbitMQ(mailOptions)
          .then(() => {
            consumeFromRabbitMQ();
          })
          .catch((error) => {
            console.error("Error:", error);
          });

      }
    );

    //await logs(req, "User created", "User created");
    return res.status(statusCodes[201]).json({
      data: resource,
      msg,
      extra,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.updateUser = async (req, res) => {
  try {
    await validationCheck(req, res);
    removeFields(UserUpdateExcludedFields, req.body);
    updateDocument(req, res, User, "User updated successfully");
  } catch (error) {
    console.log(error);
  }
};
exports.uploadAvatar = async (req, res) => {
  try {
    await validationCheck(req, res);
    let imageUrl = await uploadImage(
      req.body.avatar,
      "avatar",
      "SchoolBook-Avatar"
    );
    req.body.avatar = imageUrl;
    // await logs(req, "Upload user Avatar", "Upload user avatar");
    updateDocument(req, res, User, "Avater upload successful");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    deleteDocument(req, res, User);
  } catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    await validationCheck(req, res);
    //CHECK IF USER EXIST
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(statusCodes[400]).send({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: `Invalid user credentials` }],
      });
    }

    //check for verified

    if (!existingUser.isVerified) {
      return res.status(statusCodes[400]).send({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: `You need to verify you account to login` }],
      });
    }
    //COMPARE ENTERED PASSWORD WITH HASHED PASSWORD
    if (!(await decryptPassword(password, existingUser.password))) {
      return res.status(statusCodes[400]).send({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: `Invalid user credentials` }],
      });
    }
    //JWT PAYLOAD FOR SIGINED IN USER
    const payLoad = {
      user: {
        id: existingUser.id,
      },
    };
    let accessToken = await generateAccessToken(payLoad);
    let resource = { ...existingUser._doc };
    delete resource.password;
    req.user = resource;
    // await logs(req, `${existingUser.firstName} logged in`, `${existingUser.firstName} logged in`);
    res.status(statusCodes[200]).send({
      statusCode: statusCodes[200],
      responseText: responseText.SUCCESS,
      data: {
        resource,
        extra: { accessToken },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(statusCodes[500]).json({
      statusCode: statusCodes[500],
      responseText: responseText.FAIL,
      errors: [
        {
          msg: error.message || "Something went wrong, Please try again later",
        },
      ],
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
     const { email } = req.body;
     //validation
     await validationCheck(req, res);
     //CHECK IF USER EXIST
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       let passwordResetCode;

       const updatedResoure = await User.findOneAndUpdate(
         { email },
         { passwordResetCode },
         {
           new: true,
           runValidators: true,
         }
       );
       const mailOptions = {
         to: email, // Change to your recipient
         from: process.env.SENDER_EMAIL, // Change to your verified sender
         subject: "Forgot Your SchoolBook Account Password",
         text: `Use this code ${passwordResetCode} to reset your account password`,
       };

       //send email
       await publishToRabbitMQ(mailOptions)
         .then(() => {
           consumeFromRabbitMQ();
         })
         .catch((error) => {
           console.error("Error:", error);
         });
     }

     return res.status(statusCodes[200]).send({
       statusCode: statusCodes[200],
       responseText: responseText.SUCCESS,
       data: {
         msg: `A passord reset code has been sent to your email ${email}`,
         resource: {},
         extra: {},
       },
     });
  } catch (error) {
     console.log(error);
     return res.status(statusCodes[500]).json({
       statusCode: statusCodes[500],
       responseText: responseText.FAIL,
       errors: [
         {
           msg: error.message || "Something went wrong, Please try again later",
         },
       ],
     });
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const {verificationToken} = req.query

    const user = await User.findOne({ verificationToken: verificationToken});

     if (!user) {
       return res.status(statusCodes[400]).send({
         statusCode: statusCodes[400],
         responseText: responseText.FAIL,
         errors: [{ msg: `Invalid token` }],
       });
     }

     if(user.isVerified) {
      return res.status(statusCodes[400]).send({
        statusCode: statusCodes[400],
        responseText: responseText.FAIL,
        errors: [{ msg: `This user is already verified` }],
      });
     }

     user.isVerified = true;
     user.verificationToken = undefined;
     await user.save();

    //  const redirectUrl = ""; frontend login page url goes here
    //  res.redirect(redirectUrl);
    res.send('verification sucessful')

  } catch (error) {
    next(error)
  }
}
