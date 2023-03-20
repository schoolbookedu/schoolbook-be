exports.UserCreateExcludedFields = [
  "userType",
  "passwordResetToken",
  "passwordResetTokenExpires",
  "isVerified",
];

exports.UserExcludedFields = [];

exports.UserGetExcludedFields = [
  "passwordResetToken",
  "passwordResetTokenExpires",
  "password",
];

exports.UserUpdateExcludedFields = ["userType"];

exports.excludedQueryFields = ["sort", "page", "pageSize", "fields"];

exports.UniversityExcludedFields = []

exports.CourseExcludedFields = []

exports.MaterialExcludedFields = []