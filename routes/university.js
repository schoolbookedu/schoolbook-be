const express = require("express");
const {
  getAllUniversity,
  getAUniversity,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} = require("../controllers/university");
const { authenticate } = require("../middlewares/auth");

const universityRouter = express.Router();

universityRouter.get("/", authenticate, getAllUniversity)
universityRouter.get("/:id", authenticate, getAUniversity)
universityRouter.post("/", authenticate, createUniversity)
universityRouter.patch("/:id", authenticate, updateUniversity)
universityRouter.get("/:id", authenticate, deleteUniversity)


module.exports = { universityRouter }