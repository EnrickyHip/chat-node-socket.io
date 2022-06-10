const express = require("express");
const routes = express.Router();

const loginRequired = require("../src/middlewares/loginRequired");
const chatController = require("../src/controllers/chatController");

routes.get("/chat", loginRequired, chatController.index);

module.exports = routes;
