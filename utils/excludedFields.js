exports.UserCreateExcludedFields = [
  "passwordResetToken",
  "passwordResetTokenExpires",
  "isVerified",
  "verificationToken",
];

exports.UserExcludedFields = [];

exports.UserGetExcludedFields = [
  "passwordResetToken",
  "passwordResetTokenExpires",
  "password",
  "verificationToken",
];

exports.UserUpdateExcludedFields = ["password", "userType"];

exports.excludedQueryFields = ["sort", "page", "pageSize", "fields"];

exports.UniversityExcludedFields = [];

exports.CourseExcludedFields = [];

exports.MaterialExcludedFields = [];

exports.DepartmentExcludedFields = [];
