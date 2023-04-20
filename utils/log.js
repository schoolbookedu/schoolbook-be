// const Notification = require("../models/notification");
// exports.logs = async (req, subject, description) => {
//   try {
//     const logData = {
//       subject,
//       description,
//       addBy: req.user.id || req.user._id,
//     };
//     let createdLog = await Notification.create(logData);
//     console.log(createdLog);
//   } catch (error) {
//     console.log(error);
//   }
// };
