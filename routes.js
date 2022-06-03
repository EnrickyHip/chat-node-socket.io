const express = require("express");
const routes = express.Router();

const indexController = require("./src/controllers/indexController");
const loginController = require("./src/controllers/loginController");
const registerController = require("./src/controllers/registerController");
const chatController = require("./src/controllers/chatController");

const loginRequired = require("./src/middlewares/loginRequired");
const logoutRequired = require("./src/middlewares/logoutRequired");

routes.get("/", logoutRequired, indexController.index);

routes.get("/register", logoutRequired, registerController.index);
routes.post("/register", logoutRequired, registerController.register);
routes.post("/userExists", logoutRequired, registerController.userExists);

routes.get("/login", logoutRequired, loginController.index);
routes.post("/login", logoutRequired, loginController.login);
routes.get("/logout", loginRequired, loginController.logout);
routes.post("/passwordMatches", logoutRequired, loginController.passwordMatches);

routes.get("/chat", loginRequired, chatController.index);

module.exports = routes;
