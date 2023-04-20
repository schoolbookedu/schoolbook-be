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

universityRouter.get("/", getAllUniversity)
universityRouter.get("/:id", getAUniversity)
universityRouter.post("/",createUniversity)
universityRouter.patch("/:id", updateUniversity)
universityRouter.get("/:id",  deleteUniversity)


module.exports = { universityRouter }