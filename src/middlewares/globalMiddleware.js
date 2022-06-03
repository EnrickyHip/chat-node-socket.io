module.exports = (request, response, next) => {
  response.locals.user = request.session.user;
  response.locals.errors = request.flash("errors");
  response.locals.warnings = request.flash("warnings");
  response.locals.success = request.flash("success");
  next();
};
