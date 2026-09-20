import React from "react";

export default function CentreOperations({ t }) {
  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <h2>{t("📊 Centre Operations")}</h2>
        </div>
      </div>

      <div className="progress-list">
        <div className="progress-item">
          <div>
            <span>{t("Daily Capacity")}</span>
            <strong>72%</strong>
          </div>
          <div className="progress">
            <div style={{ width: "72%" }}></div>
          </div>
        </div>

        <div className="progress-item">
          <div>
            <span>{t("Queue Load")}</span>
            <strong>38%</strong>
          </div>
          <div className="progress">
            <div style={{ width: "38%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}