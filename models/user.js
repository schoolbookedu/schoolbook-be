const { Schema, model } = require("mongoose");
const { userTypes } = require("../utils/userTypes");
const { gender } = require("../utils/gender");
const { level } = require("../utils/level");
const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },

  password: {
    type: String,
  },
  country: {
    type: String,
  },

  university: {
    type: Schema.Types.ObjectId,
    ref: "University",
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  myCourses: [String],
  phoneNumber: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    enum: userTypes,
    default: userTypes.Student,
  },
  gender: {
    type: String,
    enum: gender,
  },
  level: {
    type: Number,
    enum: level,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpires: {
    type: Date,
  },
});

const User = model("User", userSchema);
module.exports = User;
