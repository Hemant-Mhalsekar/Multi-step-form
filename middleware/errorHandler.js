/**
 * Centralised error handler — mounted last in app.js.
 * Catches anything passed to next(err) from controllers or routes.
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
