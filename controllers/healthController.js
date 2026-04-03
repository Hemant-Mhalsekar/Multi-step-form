// @desc    Health check
// @route   GET /api/health
// @access  Public
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
};

module.exports = { healthCheck };
