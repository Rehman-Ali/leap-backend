require("dotenv").config();
require("./config/db_config");
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const homePageRoute = require("./routers/index");
var app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





//// ****** DEFINE ALL ROUTES HERE ******** ///////
app.use("/", homePageRoute);


const PORT = process.env.PORT || "5000";
app.set("port", PORT);

var server = http.createServer(app);
server.on("listening", () => console.log("APP IS RUNNING ON PORT " + PORT));

server.listen(PORT);

