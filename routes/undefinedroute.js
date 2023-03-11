const express = require("express");
const undefinedrouter = express.Router();
const { undefinedRoute } = require("../controllers/undefinedroute");

undefinedrouter.all("*", undefinedRoute);
module.exports = { undefinedrouter };
