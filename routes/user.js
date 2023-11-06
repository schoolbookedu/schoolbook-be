const express = require("express");
const {
  getAllUser,
  getAUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  changePassword,
} = require("../controllers/user");
const { authenticate, authorize } = require("../middlewares/auth");
const {
  UserCreationValidation,
  UserUpdateValidation,
} = require("../validations/user.validation");
const { upload } = require("../utils/imageProcessing");
const { userTypes } = require("../utils/userTypes");

const userRouter = express.Router();

userRouter.get(
  "/",
  authenticate,
  authorize([userTypes.Admin, userTypes.Developer]),
  getAllUser
);
userRouter.get("/:id", authenticate, getAUser);
userRouter.post("/", UserCreationValidation, createUser);
userRouter.post("/login", loginUser);
userRouter.patch("/:id", authenticate, UserUpdateValidation, updateUser);
userRouter.delete("/:id", authenticate, deleteUser);
userRouter.get("/profile/verify", verifyUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.patch(
  "/:id/avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatar
);
userRouter.post("/change-password", authenticate, changePassword);

module.exports = { userRouter };
