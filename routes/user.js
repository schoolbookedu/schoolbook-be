const express = require("express");
const {
  getAllUser,
  getAUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const { authenticate, authorize } = require("../middlewares/auth");
const {
  UserCreationValidation,
  UserUpdateValidation,
} = require("../validations/user.validation");

const userRouter = express.Router();

userRouter.get("/",authenticate, authorize, getAllUser);
userRouter.get("/:id", authenticate, getAUser);
userRouter.post("/", UserCreationValidation, createUser);
userRouter.post("/login", loginUser);
userRouter.patch("/:id", authenticate, UserUpdateValidation, updateUser);
userRouter.delete("/:id", authenticate, deleteUser);

module.exports = { userRouter };
