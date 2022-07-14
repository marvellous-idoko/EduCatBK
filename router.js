const express = require("express");
var indexRouter = require("./index");
var school = require("./school");
var master = require("./master");

module.exports = function(app) {
  app.use(express.json());

  app.use("/", master);
  app.use("/router1", school);
  app.use("/mstr", master);
};