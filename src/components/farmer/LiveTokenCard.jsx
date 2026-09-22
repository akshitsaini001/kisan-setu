import React from "react";

// This is the fixed order of steps a token goes through.
// It's kept outside the component so it isn't recreated on every render.
const TIMELINE_STEPS = [
  "Token Booked",
  "Entry Completed",
  "Procurement Started",
  "Quality Check",
  "Weighing",
  "Procurement Completed",
  "Payment Processing",
  "Payment Completed",
];

// --- Small helper functions -------------------------------------------
// Pulling these out of the JSX makes the return() below much easier to scan.

// Formats a date/time string into something like "04:32 PM"
function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Works out the numbers we need for the payout box at the bottom.
// "??" means "use the value on the left, unless it's null/undefined,
// in which case fall back to the value on the right."
function getPayoutDetails(farmerToken) {
  const quantity = farmerToken.actualQuantity ?? farmerToken.quantity;
  const rate = farmerToken.rate ?? 2585;
  const total = farmerToken.totalAmount ?? quantity * rate;
  return { quantity, rate, total };
}

// Decides which weight to display:
// - Before weighing is done, show the estimated weight (farmerToken.quantity).
// - Once the "Weighing" step shows up in history (and an actual weight exists),
//   switch to showing the actual weight instead.
function getWeightInfo(farmerToken, history) {
  const weighingDone = history.some((item) => item.status === "Weighing");
  const hasActualWeight =
    farmerToken.actualQuantity !== undefined &&
    farmerToken.actualQuantity !== null;

  if (weighingDone && hasActualWeight) {
    return { label: "Actual Weight", value: farmerToken.actualQuantity };
  }
  return { label: "Estimated Weight", value: farmerToken.quantity };
}

// --- One row of the timeline -------------------------------------------
// Splitting this into its own component means the main component's
// return() doesn't have a big .map() with nested logic inside it.
function TimelineStep({ step, index, history, t }) {
  // "reached" = true if this step has already happened.
  // The very first step (index 0) is always considered reached.
  const reached =
    index === 0 || history.some((item) => item.status === step);

  // Find the matching history entry (if any) so we can show its timestamp.
  const matchingEvent = history.find((item) => item.status === step);

  return (
    <div className={`live-timeline-step ${reached ? "done" : ""}`}>
      <span>{reached ? "✓" : index + 1}</span>
      <div>
        <strong>{t(step)}</strong>
        {matchingEvent && <small>{formatTime(matchingEvent.time)}</small>}
      </div>
    </div>
  );
}

// --- Main component ------------------------------------------------------
export default function LiveTokenCard({
  farmerToken,
  getQueueAhead,
  getTokenStatusLabel,
  t,
}) {
  // If there's no token yet, render nothing.
  if (!farmerToken) return null;

  const history = farmerToken.history || [];
  const { total: totalPayout } = getPayoutDetails(farmerToken);
  const lastUpdatedTime = farmerToken.updatedAt || farmerToken.createdAt;
  const weightInfo = getWeightInfo(farmerToken, history);

  // Only show the payout box if we actually have quantity/amount data.
  const shouldShowPayout = Boolean(
    farmerToken.actualQuantity || farmerToken.totalAmount
  );

  return (
    <div className="live-token-card">
      {/* Header: token ID + "LIVE" badge */}
      <div className="live-token-header">
        <div>
          <div className="eyebrow">{t("LIVE TOKEN STATUS")}</div>
          <h2>🎫 {farmerToken.id}</h2>
        </div>
        <span className="live-badge">{t("● LIVE")}</span>
      </div>

      <p className="live-token-subtitle">
        {t("Your procurement journey is updated in real time.")}
      </p>

      {/* Current status + queue position */}
      <div className="live-status-main">
        <span className="live-status-dot"></span>
        <div>
          <strong>{t(getTokenStatusLabel(farmerToken.status))}</strong>
          <span>
            {t("Farmers ahead")}: {getQueueAhead(farmerToken)}
          </span>
        </div>
      </div>

      {/* Weight — shows "Estimated" until Weighing is done, then "Actual" */}
      <div className="live-weight-info">
        <span>{t(weightInfo.label)}</span>
        <strong>{weightInfo.value} kg</strong>
      </div>

      {/* Step-by-step progress timeline */}
      <div className="live-timeline">
        {TIMELINE_STEPS.map((step, index) => (
          <TimelineStep
            key={step}
            step={step}
            index={index}
            history={history}
            t={t}
          />
        ))}
      </div>

      {/* Footer: last updated time + centre location */}
      <div className="live-token-footer">
        <span>
          {t("Last updated")}: {formatTime(lastUpdatedTime)}
        </span>
        <span>📍 {farmerToken.centre}</span>
      </div>

      {/* Final payout summary — only shown once quantity/amount is known */}
      {shouldShowPayout && (
        <div className="live-payout-summary">
          <span>{t("Final Estimated Payout")}</span>
          <strong>₹{Number(totalPayout).toLocaleString()}</strong>
        </div>
      )}
    </div>
  );
}
