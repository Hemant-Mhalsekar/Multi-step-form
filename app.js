const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const requirementRoutes = require("./routes/requirementRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ─── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", healthRoutes);
app.use("/api/requirements", requirementRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
