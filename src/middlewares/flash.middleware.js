const { FLASH_COOKIE } = require("../utils/flash");

// Reads the one-time flash cookie into res.locals for the view, then clears
// it so a page refresh doesn't re-show the same toast.
function consumeFlash(req, res, next) {
  const raw = req.cookies[FLASH_COOKIE];
  if (raw) {
    try {
      res.locals.flash = JSON.parse(raw);
    } catch (err) {
      res.locals.flash = null;
    }
    res.clearCookie(FLASH_COOKIE);
  } else {
    res.locals.flash = null;
  }
  next();
}

module.exports = consumeFlash;
