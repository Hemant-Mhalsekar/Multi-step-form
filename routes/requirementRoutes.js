const express = require("express");
const router = express.Router();
const {
  submitRequirement,
  getRequirements,
  getRequirementById,
} = require("../controllers/requirementController");

// POST /api/requirements       → submit a new event requirement
router.post("/", submitRequirement);

// GET  /api/requirements       → list all (supports ?category= and ?eventType= filters)
router.get("/", getRequirements);

// GET  /api/requirements/:id   → fetch a single requirement
router.get("/:id", getRequirementById);

module.exports = router;
