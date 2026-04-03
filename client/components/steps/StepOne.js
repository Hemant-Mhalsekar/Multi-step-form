"use client";

import FormField from "@/components/FormField";

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "Wedding", "Corporate", "Concert", "Birthday", "Conference",
  "Exhibition", "Festival", "Private Party", "Other",
];

const CATEGORIES = [
  { id: "planner",   name: "Planner",   desc: "Budget & logistics" },
  { id: "performer", name: "Performer", desc: "Stage & performance" },
  { id: "crew",      name: "Crew",      desc: "Technical & support" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StepOne({ data, onUpdate }) {
  const set = (field, value) => onUpdate({ [field]: value });

  const setDate = (key, value) =>
    onUpdate({ date: { ...data.date, [key]: value } });

  return (
    <div className="step-enter">
      <div className="step-header">
        <h2>Event Information</h2>
        <p>Tell us about your event and the role you need filled.</p>
      </div>

      <div className="form-grid">
        <FormField label="Event Name">
          <input
            id="eventName"
            type="text"
            placeholder="e.g. Annual Tech Summit"
            value={data.eventName}
            onChange={(e) => set("eventName", e.target.value)}
          />
        </FormField>

        <FormField label="Event Type">
          <select
            id="eventType"
            value={data.eventType}
            onChange={(e) => set("eventType", e.target.value)}
          >
            <option value="">Select type…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Date / Date Range">
          <div className="date-range">
            <input
              id="dateStart"
              type="date"
              value={data.date.start}
              onChange={(e) => setDate("start", e.target.value)}
            />
            <input
              id="dateEnd"
              type="date"
              value={data.date.end}
              min={data.date.start || undefined}
              onChange={(e) => setDate("end", e.target.value)}
            />
          </div>
          <span className="tag-input__hint" style={{ marginTop: "0.25rem" }}>
            Leave end date blank for a single-day event
          </span>
        </FormField>

        <FormField label="Location">
          <input
            id="location"
            type="text"
            placeholder="e.g. New York, NY"
            value={data.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </FormField>

        <FormField label="Venue" optional>
          <input
            id="venue"
            type="text"
            placeholder="e.g. Grand Ballroom"
            value={data.venue}
            onChange={(e) => set("venue", e.target.value)}
          />
        </FormField>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <FormField label="Category">
          <div className="category-grid" style={{ marginTop: "0.5rem" }}>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                id={`category-${cat.id}`}
                className={`category-card ${data.category === cat.id ? "selected" : ""}`}
                onClick={() => set("category", cat.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && set("category", cat.id)}
                aria-pressed={data.category === cat.id}
              >
                <p className="category-card__name">{cat.name}</p>
                <p className="category-card__desc">{cat.desc}</p>
              </div>
            ))}
          </div>
        </FormField>
      </div>
    </div>
  );
}
