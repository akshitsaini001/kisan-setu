import React from "react";

export default function LiveTokenCard({
  farmerToken,
  getQueueAhead,
  getTokenStatusLabel,
  t,
}) {
  if (!farmerToken) return null;

  const payoutQuantity = farmerToken.actualQuantity ?? farmerToken.quantity;
  const payoutRate = farmerToken.rate ?? 2585;
  const totalPayout = farmerToken.totalAmount ?? payoutQuantity * payoutRate;

  const timelineSteps = [
    "Token Booked",
    "Entry Completed",
    "Procurement Started",
    "Quality Check",
    "Weighing",
    "Procurement Completed",
    "Payment Processing",
    "Payment Completed",
  ];

  return (
    <div className="live-token-card">
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

      <div className="live-status-main">
        <span className="live-status-dot"></span>
        <div>
          <strong>{t(getTokenStatusLabel(farmerToken.status))}</strong>
          <span>
            {t("Farmers ahead")}: {getQueueAhead(farmerToken)}
          </span>
        </div>
      </div>

      <div className="live-timeline">
        {timelineSteps.map((step, index) => {
          const history = farmerToken.history || [];
          const reached =
            index === 0 || history.some((item) => item.status === step);
          const event = history.find((item) => item.status === step);

          return (
            <div
              className={`live-timeline-step ${reached ? "done" : ""}`}
              key={step}
            >
              <span>{reached ? "✓" : index + 1}</span>
              <div>
                <strong>{t(step)}</strong>
                {event && (
                  <small>
                    {new Date(event.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="live-token-footer">
        <span>
          {t("Last updated")}:{" "}
          {new Date(
            farmerToken.updatedAt || farmerToken.createdAt
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        <span>📍 {farmerToken.centre}</span>
      </div>

      {(farmerToken.actualQuantity || farmerToken.totalAmount) && (
        <div className="live-payout-summary">
          <span>{t("Final Estimated Payout")}</span>
          <strong>₹{Number(totalPayout).toLocaleString()}</strong>
        </div>
      )}
    </div>
  );
}