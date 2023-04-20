const express = require('express');
const {getAllUser,getAUser,createUser,updateUser,deleteUser}= require("../controllers/user")
const { authenticate } = require("../middlewares/auth")

const userRouter = express.Router();

userRouter.get("/", authenticate, getAllUser)
userRouter.get("/:id", authenticate, getAUser)
// userRouter.post("/", createUserValidation, createUser)
// userRouter.patch("/", createUserValidation, updateUser)
userRouter.delete("/:id", authenticate, deleteUser)


module.exports = { userRouter };