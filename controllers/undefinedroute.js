exports.undefinedRoute = (req, res) => {
  console.log("Invalid Route accessed", req.originalUrl);
  res.status(404).json({
    statusCode: 404,
    statusText: "FAIL",
    errors: [
      {
        msg: `OOP! ${req.ip} you visited an invalid route or endpoint ${req.originalUrl}`,
      },
    ],
  });
};
