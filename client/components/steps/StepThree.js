"use client";

import FormField from "@/components/FormField";
import TagInput  from "@/components/TagInput";

// ─── Metadata per category ────────────────────────────────────────────────────

const META_BY_CATEGORY = {
  planner:   { title: "Services Needed",        sub: "List all services required for the event." },
  performer: { title: "Equipment Requirements", sub: "Describe the technical equipment needed."  },
  crew:      { title: "Shift Duration",         sub: "Specify how long each crew shift runs."    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StepThree({ category, data, onUpdate }) {
  const meta = META_BY_CATEGORY[category] ?? { title: "Additional Details", sub: "" };

  return (
    <div className="step-enter">
      <div className="step-header">
        <h2>{meta.title}</h2>
        <p>{meta.sub}</p>
      </div>

      <div className="form-grid">
        {category === "planner" && (
          <FormField label="Services Needed">
            <TagInput
              tags={data.servicesNeeded ?? []}
              onChange={(tags) => onUpdate({ servicesNeeded: tags })}
              placeholder="e.g. Catering, Photography…"
            />
          </FormField>
        )}

        {category === "performer" && (
          <FormField label="Equipment Needed">
            <textarea
              id="equipmentNeeded"
              rows={4}
              placeholder="e.g. PA system, stage monitors, DI boxes, 2× microphones…"
              value={data.equipmentNeeded ?? ""}
              onChange={(e) => onUpdate({ equipmentNeeded: e.target.value })}
              style={{ resize: "vertical" }}
            />
          </FormField>
        )}

        {category === "crew" && (
          <FormField label="Shift Duration (hours)">
            <input
              id="shiftDuration"
              type="number"
              min={0}
              step={0.5}
              placeholder="e.g. 8"
              value={data.shiftDuration ?? ""}
              onChange={(e) => onUpdate({ shiftDuration: e.target.value })}
            />
          </FormField>
        )}
      </div>
    </div>
  );
}
