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
      const io = request.app.get("io");

      io.users.addUser(login.user);
      io.emit("enter chat", { name: login.user.name, email: login.user.email });

      request.session.user = login.user;
      request.session.save(() => response.redirect("/chat"));
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};

exports.logout = (request, response) => {
  const io = request.app.get("io");

  io.emit("exit chat", request.session.user);
  io.users.removeUser(request.session.user);
  io.emit("add users status", io.users.users);

  request.session.destroy();
  response.redirect("/");
};

exports.passwordMatches = async (request, response) => {
  const login = new Login(request.body);
  await login.getUser();
  const passwordMatches = login.passwordsMatch();

  return response.send(!!passwordMatches);
};
