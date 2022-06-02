module.exports = (request, response, next) => {
  response.locals.user = request.session.user;
  next();
};
