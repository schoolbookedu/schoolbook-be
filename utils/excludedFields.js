exports.UserCreateExcludedFields = [
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

exports.UserUpdateExcludedFields = ["password", "userType"];

exports.excludedQueryFields = ["sort", "page", "pageSize", "fields"];

exports.UniversityExcludedFields = []

exports.CourseExcludedFields = []

exports.MaterialExcludedFields = []

exports.DepartmentExcludedFields = []