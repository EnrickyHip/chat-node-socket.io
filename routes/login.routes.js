const express = require("express");
const routes = express.Router();

const loginController = require("../src/controllers/loginController");
const loginRequired = require("../src/middlewares/loginRequired");
const logoutRequired = require("../src/middlewares/logoutRequired");

routes.get("/login", logoutRequired, loginController.index);
routes.post("/login", logoutRequired, loginController.login);
routes.get("/logout", loginRequired, loginController.logout);
routes.post("/passwordMatches", logoutRequired, loginController.passwordMatches);

module.exports = routes;
