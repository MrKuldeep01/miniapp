// Wraps an async route/controller handler so a rejected promise reaches
// Express's error middleware instead of crashing the process or hanging.
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
