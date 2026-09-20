import React from "react";

export default function SellingOptionsCompare({
  crop,
  quantity,
  governmentRate,
  marketRate,
  onSelectGovernment,
  onSelectMarket,
  onBack,
  t,
}) {
  return (
    <main className="container">
      <button className="back-button" onClick={onBack}>
        {t("← Back")}
      </button>

      <div className="welcome-card">
        <div>
          <div className="eyebrow">{t("SELLING OPTIONS")}</div>
          <h1>
            {crop} • {quantity} Quintal
          </h1>
          <p>
            {t("Compare government procurement with verified market demand.")}
          </p>
        </div>
      </div>

      <div className="comparison">
        {/* GOVERNMENT */}
        <div className="option-card government">
          <div className="option-header">
            <span className="option-icon">🏛️</span>
            <div>
              <h2>{t("Government MSP")}</h2>
              <span>{t("Procurement Centre")}</span>
            </div>
          </div>

          <div className="price">
            ₹{governmentRate.toLocaleString()}
            <span>{t("/quintal")}</span>
          </div>

          <div className="total">
            <span>{t("Estimated Value")}</span>
            <strong>
              ₹{(governmentRate * Number(quantity || 0)).toLocaleString()}
            </strong>
          </div>

          <div className="profit">{t("✔ MSP price protected")}</div>
          <div className="warning">{t("⚠️ Token / queue required")}</div>

          <button className="primary-button" onClick={onSelectGovernment}>
            {t("Find Procurement Centre")}
          </button>
        </div>

        {/* MARKET */}
        <div className="option-card market">
          <div className="option-header">
            <span className="option-icon">🏢</span>
            <div>
              <h2>{t("Verified Market")}</h2>
              <span>{t("Private Buyer Demand")}</span>
            </div>
          </div>

          <div className="verified">{t("✓ Verified Buyers")}</div>

          <div className="price">
            ₹{marketRate.toLocaleString()}
            <span>{t("/quintal")}</span>
          </div>

          <div className="total">
            <span>{t("Estimated Value")}</span>
            <strong>
              ₹{(marketRate * Number(quantity || 0)).toLocaleString()}
            </strong>
          </div>

          <div className="profit">
            + ₹
            {(
              (marketRate - governmentRate) *
              Number(quantity || 0)
            ).toLocaleString()}{" "}
            {t("possible upside")}
          </div>

          <button className="secondary-button" onClick={onSelectMarket}>
            {t("View Buyer Demand")}
          </button>
        </div>
      </div>
    </main>
  );
}