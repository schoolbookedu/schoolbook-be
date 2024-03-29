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

universityRouter.get("/", getAllUniversity);
universityRouter.get("/:id", getAUniversity);
universityRouter.post("/", authenticate, createUniversity);
universityRouter.patch("/:id", authenticate, updateUniversity);
universityRouter.delete("/:id", authenticate, deleteUniversity);

module.exports = { universityRouter };
