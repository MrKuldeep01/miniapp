function notFoundHandler(req, res) {
  res.status(404).render("error", {
    status: 404,
    heading: "Page not found",
    message: "Sorry, we couldn't find the page you're looking for.",
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).render("error", {
    status,
    heading: "Something went wrong",
    message: "Please try again in a moment.",
  });
}

module.exports = { notFoundHandler, errorHandler };
