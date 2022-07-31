var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
require("dotenv").config();
var router = require("./routes/routing");
//const path=require('path');
var cors = require("cors");
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", router);
const PORT = process.env.PORT || 1020;
app.listen(PORT);
console.log("Server listening on port " + String(PORT));
