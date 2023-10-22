//NPM modules
require("dotenv").config(); //require the config files
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const ejs = require("ejs");

//user defined modules

const { userRouter } = require("./routes/user");
const { undefinedrouter } = require("./routes/undefinedroute");
const { universityRouter } = require("./routes/university");
const { departmentRouter } = require("./routes/department");
const { courseRouter } = require("./routes/course");
const { materialRouter } = require("./routes/material");

// db controller
const connectToDB = require("./utils/dbcon");

connectToDB();

const app = express();
app.enable("trust proxy");

app.use(helmet()); //middleware to set security HTTP headers
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json({ limit: "1000mb" })); //middleware for body-paser
app.use(bodyParser.urlencoded({ extended: true, limit: "1000mb" }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(cors()); //middle ware to allow cross origin resource sharing

//protect DB from NOSQL query injections using the express-mongo-sanitize middleware
// intercept the req.body, req.params, and req.query and remove malicious codes
app.use(mongoSanitizer()); //removed because of mathematices

//protect data from xss attack using the xss-clean middleware
// work on HTML to sanitize the data from malicious script
app.use(xss());

//cookie parser for parsing the the request cookies
app.use(cookieParser());

//protect against parameter pollution using the hpp middleware
//works on url parameters to sanitize it eg. remove duplicate parameters
app.use(hpp({ whitelist: [] })); // use the whitelist option to specify some parameter that you want to allow duplicate in the array

//middleware to log all requests to the api
app.use((req, res, next) => {
  let payloadSize = req.headers["content-length"];
  console.log(`[Request Payload Size: ${payloadSize}]`);
  console.log(
    `[time: "${new Date().toISOString()}"  method: "${req.method}"   url: "${
      req.originalUrl
    }"  payload: "${JSON.stringify(req.body)}"  user-agent: "${
      req.headers["user-agent"]
    }"  ip: "${req.ip}"]`
  );
  next();
});

//routes
app.get("/", (req, res) => {
  res.json({
    statusCode: 200,
    data: `welcome ${req.ip}`,
    statusText: "Success",
  });

  //   const renderTemplate = ejs.render(template);

  // res.send(renderTemplate)
});

app.use("/api/v1/users", userRouter); //users route
app.use("/api/v1/universities", universityRouter); //univesity route
app.use("/api/v1/departments", departmentRouter); //department route
app.use("/api/v1/courses", courseRouter); //course route
app.use("/api/v1/materials", materialRouter); //material route

//catch undefined endpoints
app.use(undefinedrouter);

//spin up the server on the env port number
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
