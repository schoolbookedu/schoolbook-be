const express = require("express");
const {
  getAllUser,
  getAUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const { authenticate } = require("../middlewares/auth");
const {
  UserCreationValidation,
  UserUpdateValidation,
} = require("../validations/user.validation");

const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.get("/:id", getAUser);
userRouter.post("/", UserCreationValidation, createUser);
userRouter.post("/login", loginUser);
userRouter.patch("/:id", UserUpdateValidation, updateUser);
userRouter.delete("/:id", authenticate, deleteUser);

module.exports = { userRouter };
