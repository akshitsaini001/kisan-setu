import React from "react";
import CropCards from "../common/CropCards";
import LiveTokenCard from "./LiveTokenCard";

export default function FarmerDashboard({
  loginId,
  crop,
  setCrop,
  quantity,
  setQuantity,
  goToCompare,
  farmerToken,
  getQueueAhead,
  getTokenStatusLabel,
  setShowVoiceAssistant,
  t,
}) {
  return (
    <main className="container">
      <div className="welcome-card">
        <div>
          <div className="eyebrow">{t("FARMER DASHBOARD")}</div>
          <h1>Welcome, {loginId || "Farmer"} 👨‍🌾</h1>
          <p>{t("Tell us about your crop to find the best selling option.")}</p>
        </div>
      </div>

      {/* VOICE ASSISTANT BANNER */}
      <div
        style={{
          marginBottom: "24px",
          padding: "18px 20px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f0fdf4, #ecfeff)",
          border: "1px solid #bbf7d0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              fontSize: "26px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            🎙️
          </div>
          <div>
            <strong style={{ display: "block", fontSize: "17px" }}>
              {t("AI Voice Assistant")}
            </strong>
            <span style={{ color: "#64748b", fontSize: "14px" }}>
              {t("Get quick help with Nova Farm features and procurement.")}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setShowVoiceAssistant(true)}
          style={{ margin: 0, whiteSpace: "nowrap" }}
        >
          🎙️ {t("Ask Assistant")}
        </button>
      </div>

      <LiveTokenCard
        farmerToken={farmerToken}
        getQueueAhead={getQueueAhead}
        getTokenStatusLabel={getTokenStatusLabel}
        t={t}
      />

      <div className="card">
        <h2>{t("🌾 Crop Details")}</h2>
        <CropCards value={crop} onChange={setCrop} t={t} />

        <div className="login-field">
          <label>{t("Expected Quantity (Quintal)")}</label>
          <input
            type="number"
            placeholder={t("Example: 50")}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button className="primary-button" onClick={goToCompare}>
          {t("Compare Selling Options →")}
        </button>
      </div>

      <div className="info-card">
        <strong>{t("💡 Nova Farm")}</strong>
        <p>
          Government MSP aur verified private buyer demand ko compare karke
          farmer ko better option choose karne mein help karta hai.
        </p>
      </div>
    </main>
  );
}