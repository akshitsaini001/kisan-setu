import React from "react";

export default function TokenSuccess({
  farmerToken,
  latestToken,
  loginId,
  crop,
  quantity,
  selectedCentre,
  getQueueAhead,
  onBack,
  t,
}) {
  const currentToken = farmerToken || latestToken;

  return (
    <main className="container">
      <div className="token-card">
        <div className="success-icon">✓</div>
        <div className="eyebrow">{t("TOKEN GENERATED")}</div>
        <h1>{t("Your procurement token is ready")}</h1>

        <div className="token-number">{currentToken?.id}</div>

        <div className="token-details">
          <div>
            <span>{t("Farmer")}</span>
            <strong>{loginId || "Demo Farmer"}</strong>
          </div>
          <div>
            <span>{t("Crop")}</span>
            <strong>{crop}</strong>
          </div>
          <div>
            <span>{t("Quantity")}</span>
            <strong>{quantity} Quintal</strong>
          </div>
          <div>
            <span>{t("Centre")}</span>
            <strong>{selectedCentre?.name}</strong>
          </div>
          <div>
            <span>{t("Status")}</span>
            <strong>{t("Waiting")}</strong>
          </div>
        </div>

        {farmerToken && (
          <div className="live-token-mini">
            <strong>{t("Live update")}</strong>
            <span>
              {t("Farmers ahead")}: {getQueueAhead(farmerToken)}
            </span>
            <span>
              {t("Last updated")}:{" "}
              {new Date(
                farmerToken.updatedAt || farmerToken.createdAt
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}

        <div className="queue-box">
          <strong>{t("⏱ Estimated waiting time")}</strong>
          <p>{selectedCentre?.waitTime}</p>
        </div>

        <button className="primary-button" onClick={onBack}>
          {t("Back to Farmer Dashboard")}
        </button>
      </div>
    </main>
  );
}