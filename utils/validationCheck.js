const { validationResult } = require("express-validator");
const { statusCodes, responseText } = require("./response");

exports.validationCheck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCodes[400]).json({
      statusCode: statusCodes[400],
      responseText: responseText.FAIL,
      errors: errors.array(),
    });
  }
};
