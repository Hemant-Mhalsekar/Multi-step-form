"use client";

import FormField from "@/components/FormField";

// ─── Field definitions per category ──────────────────────────────────────────

const FIELDS_BY_CATEGORY = {
  planner: [
    { key: "budget",     label: "Budget (USD)",      type: "number", placeholder: "e.g. 50000" },
    { key: "guestCount", label: "Guest Count",        type: "number", placeholder: "e.g. 200"   },
  ],
  performer: [
    { key: "performerType", label: "Performer Type",      type: "text",   placeholder: "e.g. DJ, Band, Comedian" },
    { key: "duration",      label: "Duration (minutes)",  type: "number", placeholder: "e.g. 90"                 },
  ],
  crew: [
    { key: "role",           label: "Role",             type: "text",   placeholder: "e.g. Stage Manager" },
    { key: "numberOfPeople", label: "Number of People", type: "number", placeholder: "e.g. 5"            },
  ],
};

const META_BY_CATEGORY = {
  planner:   { title: "Planner Details",   sub: "Budget and headcount for your event." },
  performer: { title: "Performer Details", sub: "Tell us about the performance requirements." },
  crew:      { title: "Crew Details",      sub: "Role and staffing information." },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StepTwo({ category, data, onUpdate }) {
  const fields = FIELDS_BY_CATEGORY[category] ?? [];
  const meta   = META_BY_CATEGORY[category]   ?? { title: "Details", sub: "" };

  return (
    <div className="step-enter">
      <div className="step-header">
        <h2>{meta.title}</h2>
        <p>{meta.sub}</p>
      </div>

      <div className="form-grid">
        {fields.map(({ key, label, type, placeholder }) => (
          <FormField key={key} label={label}>
            <input
              id={key}
              type={type}
              placeholder={placeholder}
              value={data[key] ?? ""}
              min={type === "number" ? 0 : undefined}
              onChange={(e) => onUpdate({ [key]: e.target.value })}
            />
          </FormField>
        ))}
      </div>
    </div>
  );
}
