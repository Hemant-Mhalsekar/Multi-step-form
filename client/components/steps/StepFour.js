"use client";

const fmt = (val) => {
  if (val === null || val === undefined || val === "") return "—";
  if (Array.isArray(val)) return val;
  return String(val);
};

function ReviewRow({ label, value }) {
  const isArray = Array.isArray(value);
  return (
    <div className="review-row">
      <span className="review-row__key">{label}</span>
      {isArray ? (
        <div className="review-tags">
          {value.length > 0
            ? value.map((v) => <span key={v} className="review-tag">{v}</span>)
            : <span className="review-row__val">—</span>}
        </div>
      ) : (
        <span className="review-row__val">{value === "" || value === null || value === undefined ? "—" : value}</span>
      )}
    </div>
  );
}

function Section({ title, rows }) {
  return (
    <div className="review-section">
      <p className="review-section__title">{title}</p>
      {rows.map(([label, value]) => (
        <ReviewRow key={label} label={label} value={fmt(value)} />
      ))}
    </div>
  );
}

export default function StepFour({ data }) {
  const cat = data.category;
  const d   = data.details?.[cat] ?? {};

  /* Build dynamic detail rows based on category */
  const detailRows = {
    planner: [
      ["Budget (USD)",   d.budget],
      ["Guest Count",    d.guestCount],
      ["Services Needed", d.servicesNeeded ?? []],
    ],
    performer: [
      ["Performer Type",  d.performerType],
      ["Duration (min)",  d.duration],
      ["Equipment Needed", d.equipmentNeeded],
    ],
    crew: [
      ["Role",            d.role],
      ["Number of People", d.numberOfPeople],
      ["Shift Duration (hrs)", d.shiftDuration],
    ],
  };

  return (
    <div className="step-enter">
      <div className="step-header">
        <h2>Review Your Submission</h2>
        <p>Check everything looks right before submitting.</p>
      </div>

      <Section
        title="Event Information"
        rows={[
          ["Event Name",  data.eventName],
          ["Event Type",  data.eventType],
          ["Start Date",  data.date?.start || "—"],
          ["End Date",    data.date?.end   || "Single day"],
          ["Location",    data.location],
          ["Venue",       data.venue || "—"],
          ["Category",    cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "—"],
        ]}
      />

      <Section
        title={`${cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : ""} Details`}
        rows={detailRows[cat] ?? []}
      />
    </div>
  );
}
