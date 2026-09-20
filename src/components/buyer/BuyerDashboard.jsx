import React from "react";
import CreateDemandForm from "./CreateDemandForm";
import ActiveDemandsList from "./ActiveDemandsList";

export default function BuyerDashboard({
  demands,
  onCreateDemand,
  onRemoveDemand,
  formState,
  t,
}) {
  const activeDemands = demands.filter((d) => d.status === "Active");
  const totalRequired = activeDemands.reduce((sum, d) => sum + d.quantity, 0);
  const avgRate = activeDemands.length
    ? Math.round(
        activeDemands.reduce((sum, d) => sum + d.rate, 0) / activeDemands.length
      )
    : 0;

  return (
    <main className="container dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">{t("VERIFIED BUYER")}</div>
          <h1>{t("Buyer Dashboard")}</h1>
          <p>{t("Create demand and connect with farmers.")}</p>
        </div>
        <span className="live-badge">{t("✓ VERIFIED")}</span>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span>{t("Active Demands")}</span>
          <strong>{activeDemands.length}</strong>
        </div>

        <div className="stat-card">
          <span>{t("Total Required")}</span>
          <strong>{totalRequired} q</strong>
        </div>

        <div className="stat-card">
          <span>{t("Avg. Rate")}</span>
          <strong>₹ {avgRate}</strong>
        </div>
      </div>

      <CreateDemandForm {...formState} onSubmit={onCreateDemand} t={t} />
      <ActiveDemandsList
        demands={demands}
        onRemoveDemand={onRemoveDemand}
        t={t}
      />
    </main>
  );
}