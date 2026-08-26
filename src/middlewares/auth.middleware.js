const { verifyToken } = require("../utils/token");
const { setFlash } = require("../utils/flash");
const { COOKIE_NAME } = require("../constants");

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    setFlash(res, "info", "Please log in to continue.");
    return res.redirect("/login");
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.clearCookie(COOKIE_NAME);
    setFlash(res, "warn", "Your session expired — please log in again.");
    return res.redirect("/login");
  }
}

module.exports = requireAuth;
