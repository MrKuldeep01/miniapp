const FLASH_COOKIE = "flash";

// Stashes a one-time notification in a cookie so it survives the redirect
// that follows a form submit (the PRG pattern) and shows up as a toast on
// the next page render.
function setFlash(res, type, message) {
  res.cookie(FLASH_COOKIE, JSON.stringify({ type, message }), {
    httpOnly: true,
    sameSite: "lax",
  });
}

module.exports = { setFlash, FLASH_COOKIE };
