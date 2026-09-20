import React from "react";

export default function BuyerMarketList({ demands, onBack, t }) {
  return (
    <main className="container">
      <button className="back-button" onClick={onBack}>
        {t("← Back")}
      </button>

      <div className="welcome-card">
        <div>
          <div className="eyebrow">{t("VERIFIED BUYER DEMAND")}</div>
          <h1>{t("Available buyers")}</h1>
          <p>{t("These buyers have active crop requirements.")}</p>
        </div>
      </div>

      <div className="buyer-list">
        {demands
          .filter((demand) => demand.status === "Active")
          .map((demand) => (
            <div className="buyer-card" key={demand.id}>
              <div className="buyer-header">
                <div>
                  <h2>{demand.buyer}</h2>
                  <span className="verified">{t("✓ Verified Buyer")}</span>
                </div>
                <div className="buyer-rate">₹{demand.rate}/q</div>
              </div>

              <div className="buyer-info">
                <span>🌾 {demand.crop}</span>
                <span>📦 {demand.quantity} Quintal</span>
                <span>📍 {demand.location}</span>
                <span>⏳ {demand.expires}</span>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  alert(
                    t("Connection request sent to {buyer}").replace(
                      "{buyer}",
                      demand.buyer
                    )
                  )
                }
              >
                {t("Connect with Buyer")}
              </button>
            </div>
          ))}
      </div>
    </main>
  );
}