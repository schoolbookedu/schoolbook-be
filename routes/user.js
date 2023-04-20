const express = require("express");
const {
  getAllUser,
  getAUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const { authenticate } = require("../middlewares/auth");
const {
  UserCreationValidation,
  UserUpdateValidation,
} = require("../validations/user.validation");

const userRouter = express.Router();

userRouter.get("/", authenticate, getAllUser);
userRouter.get("/:id", authenticate, getAUser);
userRouter.post("/", UserCreationValidation, createUser);
userRouter.patch("/", UserUpdateValidation, updateUser);
userRouter.delete("/:id", authenticate, deleteUser);

module.exports = { userRouter };
