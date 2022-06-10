const express = require("express");
const routes = express.Router();

const index = require("./index.routes");
const chat = require("./chat.routes");
const login = require("./login.routes");
const register = require("./register.routes");

routes.use(index);
routes.use(chat);
routes.use(login);
routes.use(register);

module.exports = routes;
