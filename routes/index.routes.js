const express = require("express");
const routes = express.Router();

const logoutRequired = require("../src/middlewares/logoutRequired");
const indexController = require("../src/controllers/indexController");

routes.get("/", logoutRequired, indexController.index);

module.exports = routes;
