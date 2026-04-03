"use client";

import { useState, useMemo } from "react";
import StepIndicator         from "@/components/StepIndicator";
import StepOne               from "@/components/steps/StepOne";
import StepTwo               from "@/components/steps/StepTwo";
import StepThree             from "@/components/steps/StepThree";
import StepFour              from "@/components/steps/StepFour";
import { submitRequirement } from "@/lib/api";

// ─── Initial form state ───────────────────────────────────────────────────────

const INITIAL_STATE = {
  eventName: "",
  eventType: "",
  date:      { start: "", end: "" },
  location:  "",
  venue:     "",
  category:  "",
  details: {
    planner:   { budget: "", guestCount: "", servicesNeeded: [] },
    performer: { performerType: "", duration: "", equipmentNeeded: "" },
    crew:      { role: "", numberOfPeople: "", shiftDuration: "" },
  },
};

// ─── Step completeness guard ──────────────────────────────────────────────────
// Returns true when all required fields for the current step are filled.
// Drives the disabled state of the Next button without waiting for a click.

function checkStepComplete(step, formData) {
  const { eventName, eventType, date, location, category, details } = formData;
  const d = details[category] ?? {};

  switch (step) {
    case 1:
      return !!(eventName.trim() && eventType && date.start && location.trim() && category);
    case 2:
      if (category === "planner")   return !!(d.budget && d.guestCount);
      if (category === "performer") return !!(d.performerType && d.duration);
      if (category === "crew")      return !!(d.role && d.numberOfPeople);
      return false;
    case 3:
      if (category === "planner")   return (d.servicesNeeded?.length ?? 0) > 0;
      if (category === "performer") return !!d.equipmentNeeded?.trim();
      if (category === "crew")      return d.shiftDuration !== "" && d.shiftDuration != null;
      return false;
    case 4:
      return true;
    default:
      return false;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MultiStepForm() {
  const [step,       setStep]       = useState(1);
  const [formData,   setFormData]   = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [savedName,  setSavedName]  = useState("");
  const [apiError,   setApiError]   = useState(null);

  const isStepComplete = useMemo(
    () => checkStepComplete(step, formData),
    [step, formData]
  );

  // ─── State updaters ───────────────────────────────────────────────────────

  const updateTopLevel = (patch) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const updateDetails = (patch) =>
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [prev.category]: { ...prev.details[prev.category], ...patch },
      },
    }));

  // ─── Navigation ──────────────────────────────────────────────────────────

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);

  // ─── Submission ───────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError(null);

    try {
      await submitRequirement(formData);
      setSavedName(formData.eventName);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setFormData(INITIAL_STATE);
    setStep(1);
    setSubmitted(false);
    setApiError(null);
  };

  // ─── Success screen ───────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="form-card">
        <div className="success-screen">
          <div className="success-screen__icon">✓</div>
          <h2>All done!</h2>
          <p>
            <strong style={{ color: "var(--text)" }}>{savedName}</strong>{" "}
            has been submitted successfully.
          </p>
          <p style={{ marginTop: "0.35rem", fontSize: "0.8rem" }}>
            We'll be in touch with further details.
          </p>
          <div className="success-screen__reset">
            <button className="btn btn--ghost" onClick={reset} id="btn-reset">
              ← Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────

  const categoryDetails = formData.details[formData.category] ?? {};

  return (
    <div className="form-card">
      <StepIndicator currentStep={step} />

      <div className="step-body">
        {step === 1 && (
          <StepOne data={formData} onUpdate={updateTopLevel} />
        )}

        {step === 2 && (
          <StepTwo
            category={formData.category}
            data={categoryDetails}
            onUpdate={updateDetails}
          />
        )}

        {step === 3 && (
          <StepThree
            category={formData.category}
            data={categoryDetails}
            onUpdate={updateDetails}
          />
        )}

        {step === 4 && <StepFour data={formData} />}

        {/* API error banner */}
        {apiError && (
          <div className="api-error-banner" role="alert">
            <span className="api-error-banner__icon">⚠</span>
            <div>
              <strong>Submission failed</strong>
              <p>{apiError}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="form-nav">
          {step > 1 ? (
            <button className="btn btn--ghost" onClick={goBack} id="btn-back">
              ← Back
            </button>
          ) : (
            <span />
          )}

          <div className="form-nav__right">
            {step < 4 && (
              <span className="form-nav__counter" aria-live="polite">
                Step {step} of 4
              </span>
            )}

            {step < 4 ? (
              <button
                className="btn btn--primary"
                onClick={goNext}
                disabled={!isStepComplete}
                id="btn-next"
                title={!isStepComplete ? "Complete all required fields to continue" : undefined}
              >
                Next →
              </button>
            ) : (
              <button
                className="btn btn--success"
                onClick={handleSubmit}
                disabled={submitting}
                id="btn-submit"
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  "✓ Submit"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
