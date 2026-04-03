const mongoose = require("mongoose");

// ─── Category-specific sub-schemas ───────────────────────────────────────────

const plannerDetailsSchema = new mongoose.Schema(
  {
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    guestCount: {
      type: Number,
      min: [1, "Guest count must be at least 1"],
    },
    servicesNeeded: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const performerDetailsSchema = new mongoose.Schema(
  {
    performerType: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      min: [1, "Duration must be at least 1 minute"],
    },
    equipmentNeeded: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const crewDetailsSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      trim: true,
    },
    numberOfPeople: {
      type: Number,
      min: [1, "Must have at least 1 person"],
    },
    shiftDuration: {
      type: Number, // in hours
      min: [0, "Shift duration cannot be negative"],
    },
  },
  { _id: false }
);

// ─── Date range sub-schema ────────────────────────────────────────────────────

const dateRangeSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end: {
      type: Date,
      validate: {
        validator: function (value) {
          // end must be after start if provided
          return !value || value >= this.start;
        },
        message: "End date must be on or after the start date",
      },
    },
  },
  { _id: false }
);

// ─── Main EventRequirement schema ────────────────────────────────────────────

const eventRequirementSchema = new mongoose.Schema(
  {
    // ── Core event info ──────────────────────────────────────────
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },

    eventType: {
      type: String,
      required: [true, "Event type is required"],
      trim: true,
    },

    // Supports a single date or a date range
    date: {
      type: dateRangeSchema,
      required: [true, "Event date is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    venue: {
      type: String,
      trim: true,
    },

    // ── Category ─────────────────────────────────────────────────
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["planner", "performer", "crew"],
        message: '"{VALUE}" is not a valid category. Use planner, performer, or crew.',
      },
    },

    // ── Dynamic details based on category ────────────────────────
    details: {
      // Planner fields
      planner: {
        type: plannerDetailsSchema,
        default: undefined,
      },

      // Performer fields
      performer: {
        type: performerDetailsSchema,
        default: undefined,
      },

      // Crew fields
      crew: {
        type: crewDetailsSchema,
        default: undefined,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ─── Custom validator: enforce the correct details block ──────────────────────

eventRequirementSchema.pre("validate", function (next) {
  const category = this.category;
  const details = this.details || {};

  if (!category) return next();

  const categoryMap = {
    planner: ["performer", "crew"],
    performer: ["planner", "crew"],
    crew: ["planner", "performer"],
  };

  const disallowed = categoryMap[category] || [];
  for (const key of disallowed) {
    if (details[key] != null) {
      return next(
        new Error(
          `"details.${key}" should not be set when category is "${category}".`
        )
      );
    }
  }

  next();
});

// ─── Virtual: resolved details for the active category ───────────────────────

eventRequirementSchema.virtual("activeDetails").get(function () {
  return this.details?.[this.category] ?? null;
});

// ─── Virtual: isSingleDay check ───────────────────────────────────────────────

eventRequirementSchema.virtual("isSingleDay").get(function () {
  const { start, end } = this.date || {};
  if (!start) return null;
  if (!end) return true;
  return start.toDateString() === end.toDateString();
});

// ─── Export ───────────────────────────────────────────────────────────────────

module.exports = mongoose.model("EventRequirement", eventRequirementSchema);
