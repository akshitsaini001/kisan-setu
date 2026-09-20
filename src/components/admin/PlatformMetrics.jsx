import React from "react";

export default function PlatformMetrics({ t }) {
  return (
    <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <span>{t("Registered Farmers")}</span>
          <strong>1,248</strong>
        </div>
        <div className="stat-card">
          <span>{t("Verified Buyers")}</span>
          <strong>86</strong>
        </div>
        <div className="stat-card">
          <span>{t("Procurement Centres")}</span>
          <strong>32</strong>
        </div>
        <div className="stat-card">
          <span>{t("Pending Verification")}</span>
          <strong>7</strong>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-mini-card">
          <span>🌾</span>
          <h3>{t("Farmers")}</h3>
          <strong>1,248</strong>
          <p>{t("Registered users")}</p>
        </div>
        <div className="admin-mini-card">
          <span>🏢</span>
          <h3>{t("Buyers")}</h3>
          <strong>86</strong>
          <p>{t("Verified businesses")}</p>
        </div>
        <div className="admin-mini-card">
          <span>🏛️</span>
          <h3>{t("Centres")}</h3>
          <strong>32</strong>
          <p>{t("Active procurement centres")}</p>
        </div>
        <div className="admin-mini-card">
          <span>🎫</span>
          <h3>{t("Tokens Today")}</h3>
          <strong>384</strong>
          <p>{t("Generated today")}</p>
        </div>
      </div>
    </>
  );
}