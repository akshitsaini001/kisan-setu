import React from "react";
import PlatformMetrics from "./PlatformMetrics";
import BuyerVerificationList from "./BuyerVerificationList";

export default function AdminDashboard({ t }) {
  return (
    <main className="container dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">{t("PLATFORM ADMINISTRATION")}</div>
          <h1>{t("Admin Dashboard")}</h1>
          <p>{t("Monitor Nova Farm users and operations.")}</p>
        </div>
        <span className="live-badge">{t("● SYSTEM ONLINE")}</span>
      </div>

      <PlatformMetrics t={t} />
      <BuyerVerificationList t={t} />

      <div className="dashboard-card">
        <div className="section-header">
          <div>
            <h2>{t("📈 Platform Overview")}</h2>
          </div>
        </div>

        <div className="progress-list">
          <div className="progress-item">
            <div>
              <span>{t("Farmer Registration")}</span>
              <strong>82%</strong>
            </div>
            <div className="progress">
              <div style={{ width: "82%" }}></div>
            </div>
          </div>

          <div className="progress-item">
            <div>
              <span>{t("Buyer Verification")}</span>
              <strong>64%</strong>
            </div>
            <div className="progress">
              <div style={{ width: "64%" }}></div>
            </div>
          </div>

          <div className="progress-item">
            <div>
              <span>{t("Centre Digitisation")}</span>
              <strong>91%</strong>
            </div>
            <div className="progress">
              <div style={{ width: "91%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}