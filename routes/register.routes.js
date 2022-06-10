const express = require("express");
const routes = express.Router();

const registerController = require("../src/controllers/registerController");
const logoutRequired = require("../src/middlewares/logoutRequired");

routes.get("/register", logoutRequired, registerController.index);
routes.post("/register", logoutRequired, registerController.register);
routes.post("/userExists", logoutRequired, registerController.userExists);

module.exports = routes;
