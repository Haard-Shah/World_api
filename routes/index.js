var express = require("express");
const mysql = require("mysql"); // Need the mysql package
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "The World Database API" });
});

/* Data page */
router.get("/api", function (req, res, next) {
  res.render("index", { title: "Lots of routes available" });
});

/* All Cities Page */
router.get("/api/city", function (req, res) {
  // ---- old hacky db code ----
  // var query = "SELECT name, district FROM ??";
  // var table = ["city"];
  // query = mysql.format(query, table);
  // req.db.query(query, function (err, rows) {
  //   if (err) {
  //     res.json({
  //       Error: true,
  //       Message: "Error executing MySQL query",
  //     });
  //   } else {
  //     res.json({
  //       Error: false,
  //       Message: "Success",
  //       City: rows,
  //     });
  //   }
  // });

  req.db
    .from("city")
    .select("name", "district")
    .then((rows) => {
      res.json({
        Error: false,
        Message: "Success",
        City: rows,
      });
    })
    .catch((err) => {
      res.json({
        Error: true,
        Message: "Error executing MySQL query",
      });
    });
});

/* Filtered Cities by Country */
router.get("/api/city/:CountryCode", function (req, res) {
  // -------- Old hacky db code -------
  // var query = "SELECT * FROM ?? WHERE ??=?";
  // var table = ["city", "CountryCode", req.params.CountryCode];
  // query = mysql.format(query, table);

  // req.db.query(query, function (err, rows) {
  //   if (err) {
  //     res.json({
  //       Error: true,
  //       Message: "Error executing MySQL query",
  //     });
  //   } else {
  //     res.json({
  //       Error: false,
  //       Message: "Success",
  //       City: rows,
  //     });
  //   }
  // });

  req.db
    .from("city")
    .select("*")
    .where("CountryCode", "=", req.params.CountryCode)
    .then((rows) => {
      res.json({
        Error: false,
        Message: "Success",
        City: rows,
      });
    })
    .catch((err) => {
      res.json({
        Error: true,
        Message: "Error executing MySQL query",
      });
    });
});

module.exports = router;
