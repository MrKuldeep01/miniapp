// Exposes the current request path to every view as `path`, so shared
// partials (e.g. the navbar) can highlight the active link without every
// controller having to pass it explicitly.
function exposePath(req, res, next) {
  res.locals.path = req.path;
  next();
}

module.exports = exposePath;
