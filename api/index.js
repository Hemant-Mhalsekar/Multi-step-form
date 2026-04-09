const mongoose = require("mongoose");
const app = require("../app");

let isConnected = false;

// We export a serverless function that connects to MongoDB
// and then delegates the request to the Express app.
module.exports = async (req, res) => {
  if (!isConnected && mongoose.connection.readyState !== 1) {
    console.log("Connecting to MongoDB in serverless environment...");
    try {
      await mongoose.connect(process.env.MONGO_URI);
      isConnected = true;
      console.log("MongoDB connected in serverless function.");
    } catch (err) {
      console.error("MongoDB connection error in serverless environment:", err);
      // Don't kill the process; just respond with error.
      return res.status(500).json({ success: false, message: "Database connection failed" });
    }
  }

  // Delegate the request handling to the Express application
  return app(req, res);
};
