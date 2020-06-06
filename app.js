var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// const db = require("./database/db"); // Old hacky way of dealiying with db
// require("dotenv").config();
const knex_options = require("./knexfile");
const knex = require("knex")(knex_options);

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./docs/template.json");

const helmet = require("helmet");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// Update the conosle logger to have headers in them
logger.token("req", (req, res) => JSON.stringify(req.headers));
logger.token("res", (req, res) => {
  const headers = {};

  res.getHeaderNames().map((h) => (headers[h] = res.getHeader(h)));

  return JSON.stringify(headers);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("common"));
app.use(helmet());
app.use(cors()); // allows other web apps with different domain to access the server
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ------------- DATABASE ---------
// app.use(db); // old hacky db code

// Knex middleware to make db available for all routes
app.use((req, res, next) => {
  req.db = knex; // attach the knex db obj
  next();
});

// Knex Test code
// app.use("/knex", (req, res, next) => {
//   req.db
//     .raw("SELECT VERSION()")
//     .then((version) => console.log(version[0][0]))
//     .catch((err) => console.log(err));

//   res.send("It worked");
// });

// ----------- Routres ------------
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
