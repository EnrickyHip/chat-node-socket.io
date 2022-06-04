const { Register } = require("./../models/RegisterModel");

exports.index = (request, response) => {
  response.render("register", { values: {} });
};

exports.register = async (request, response) => {
  try {
    const register = new Register(request.body);
    await register.register();

    if (register.errors.length) {
      request.flash("errors", register.errors);
      response.locals.errors = request.flash("errors");
      request.session.save(() => response.render("register", { values: request.body }));
      return;
    }

    if (register.user) {
      request.session.user = register.user;
      request.app.get("io").emit("enter chat", register.user.name);
      request.session.save(() => response.redirect("/chat"));
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};

exports.userExists = async (request, response) => {
  const register = new Register(request.body);
  const userExists = await register.userExists();

  return response.send(!!userExists);
};
