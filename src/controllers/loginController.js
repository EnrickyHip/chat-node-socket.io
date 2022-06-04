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
      request.session.user = login.user;
      request.app.get("io").emit("enter chat", login.user.name);
      request.session.save(() => response.redirect("/chat"));
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};

exports.logout = (request, response) => {
  request.app.get("io").emit("exit chat", request.session.user.name);
  request.session.destroy();
  response.redirect("/");
};

exports.passwordMatches = async (request, response) => {
  const login = new Login(request.body);
  await login.getUser();
  const passwordMatches = login.passwordsMatch();

  return response.send(!!passwordMatches);
};
