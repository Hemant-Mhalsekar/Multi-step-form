"use client";

/* Reusable labelled field wrapper */
export default function FormField({ label, optional, error, children }) {
  return (
    <div className="field">
      <label>
        {label}
        {optional && <span className="field__optional">(optional)</span>}
      </label>
      {children}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
