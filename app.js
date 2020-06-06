var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// const db = require("./database/db"); // Old hacky way of dealiying with db
const knex_options = require("./knexfile");
const knex = require("knex")(knex_options);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
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
