const EventRequirement = require("../models/EventRequirement");

// ─── Helper: extract Mongoose validation errors into a clean map ──────────────

const parseValidationErrors = (err) => {
  return Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
};

// ─── POST /api/requirements ───────────────────────────────────────────────────

// @desc    Submit a new event requirement
// @route   POST /api/requirements
// @access  Public
const submitRequirement = async (req, res, next) => {
  try {
    const {
      eventName,
      eventType,
      date,
      location,
      venue,
      category,
      details,
    } = req.body;

    // ── Manual required-field check (before hitting the DB) ──────────────────
    const missing = [];
    if (!eventName)    missing.push("eventName");
    if (!eventType)    missing.push("eventType");
    if (!date?.start)  missing.push("date.start");
    if (!location)     missing.push("location");
    if (!category)     missing.push("category");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing,
      });
    }

    // ── Category ↔ details consistency check ─────────────────────────────────
    const validCategories = ["planner", "performer", "crew"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category "${category}". Must be one of: ${validCategories.join(", ")}.`,
      });
    }

    if (details && !details[category]) {
      return res.status(400).json({
        success: false,
        message: `"details.${category}" is required when category is "${category}".`,
      });
    }

    // ── Create & persist ──────────────────────────────────────────────────────
    const requirement = await EventRequirement.create({
      eventName,
      eventType,
      date,
      location,
      venue,
      category,
      details,
    });

    return res.status(201).json({
      success: true,
      message: "Event requirement submitted successfully",
      data: requirement,
    });

  } catch (err) {
    // Mongoose validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseValidationErrors(err),
      });
    }

    // Duplicate key (e.g. unique index violation)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `Duplicate value for field: "${field}"`,
      });
    }

    // Pre-validate hook errors (category mismatch)
    if (err.message?.startsWith('"details.')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Anything else → global error handler
    next(err);
  }
};

// ─── GET /api/requirements ────────────────────────────────────────────────────

// @desc    Fetch all submitted event requirements
// @route   GET /api/requirements
// @access  Public
const getRequirements = async (req, res, next) => {
  try {
    const { category, eventType } = req.query;

    const filter = {};
    if (category)  filter.category  = category;
    if (eventType) filter.eventType = eventType;

    const requirements = await EventRequirement.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requirements.length,
      data: requirements,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/requirements/:id ────────────────────────────────────────────────

// @desc    Fetch a single event requirement by ID
// @route   GET /api/requirements/:id
// @access  Public
const getRequirementById = async (req, res, next) => {
  try {
    const requirement = await EventRequirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: `No requirement found with ID: ${req.params.id}`,
      });
    }

    return res.status(200).json({ success: true, data: requirement });
  } catch (err) {
    // Malformed ObjectId
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: "${req.params.id}"`,
      });
    }
    next(err);
  }
};

module.exports = { submitRequirement, getRequirements, getRequirementById };
