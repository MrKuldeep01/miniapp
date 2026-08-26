const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const exposePath = require("./middlewares/locals.middleware");
const consumeFlash = require("./middlewares/flash.middleware");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(exposePath);
app.use(consumeFlash);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
