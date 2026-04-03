"use client";

import { Fragment } from "react";

const STEPS = ["Event Info", "Details", "More Details", "Review"];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">
      <div className="step-indicator__track">
        {STEPS.map((label, idx) => {
          const stepNum  = idx + 1;
          const isDone   = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <Fragment key={label}>
              <div className="step-indicator__step">
                <div
                  className={[
                    "step-indicator__bubble",
                    isActive ? "active" : "",
                    isDone   ? "done"   : "",
                  ].join(" ")}
                >
                  {isDone ? "✓" : stepNum}
                </div>
                <span
                  className={[
                    "step-indicator__label",
                    isActive ? "active" : "",
                    isDone   ? "done"   : "",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div className={`step-indicator__line ${isDone ? "done" : ""}`} />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
