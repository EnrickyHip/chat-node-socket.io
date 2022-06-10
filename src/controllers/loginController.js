const Login = require("../models/LoginModel");

exports.index = (request, response) => {
  response.render("login", { values: {} });
};

exports.login = async (request, response) => {
  try {
    const login = new Login(request.body);
    await login.login();

    if (login.errors.length) {
      request.flash("errors", login.errors);
      response.locals.errors = request.flash("errors");
      request.session.save(() => response.render("login", { values: request.body }));
      return;
    }

    if (login.user) {
      const user = { name: login.user.name, email: login.user.email };
      request.session.user = user;
      request.session.save(() => response.redirect("/chat"));
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};

exports.logout = async (request, response) => {
  const io = request.app.get("io");
  const message = { user: request.session.user, text: "saiu do chat", type: "main", date: new Date() };

  await io.users.removeUser(request.session.user);
  io.messages.addMessage(message);
  io.emit("add-main-message", message);
  io.emit("add-users-status", await io.users.getAllUsers());

  request.session.destroy();
  response.redirect("/");
};

exports.passwordMatches = async (request, response) => {
  const login = new Login(request.body);
  await login.getUser();
  const passwordMatches = login.passwordsMatch();

  return response.send(!!passwordMatches);
};
