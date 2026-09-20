import React from "react";

export default function ActiveDemandsList({ demands, onRemoveDemand, t }) {
  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <h2>{t("📋 Active Demands")}</h2>
          <p>{t("Your current crop requirements.")}</p>
        </div>
      </div>

      <div className="demand-list">
        {demands
          .filter((d) => d.status === "Active")
          .map((demand) => (
            <div className="demand-row" key={demand.id}>
              <div>
                <strong>{demand.crop}</strong>
                <span>
                  {demand.quantity} q • ₹{demand.rate}/q
                </span>
              </div>
              <div>
                <span>📍 {demand.location}</span>
              </div>
              <button
                className="danger-button"
                onClick={() => onRemoveDemand(demand.id)}
              >
                {t("Remove")}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}