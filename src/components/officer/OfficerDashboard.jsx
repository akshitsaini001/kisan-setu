import React from "react";
import TokenQueueTable from "./TokenQueueTable";
import CentreOperations from "./CentreOperations";

export default function OfficerDashboard({
  tokens,
  officerCentre,
  onUpdateStatus,
  getNextOfficerAction,
  t,
}) {
  const filteredTokens = tokens.filter(
    (token) =>
      token.centre === officerCentre?.centreName &&
      token.status !== "Payment Completed"
  );

  const waitingCount = tokens.filter(
    (token) =>
      token.centre === officerCentre?.centreName && token.status === "Waiting"
  ).length;

  const processingCount = tokens.filter(
    (token) =>
      token.centre === officerCentre?.centreName &&
      token.status === "Processing"
  ).length;

  const completedCount = tokens.filter(
    (token) =>
      token.centre === officerCentre?.centreName && token.status === "Completed"
  ).length;

  return (
    <main className="container dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">{t("PROCUREMENT MANAGEMENT")}</div>
          <h1>{t("Officer Dashboard")}</h1>
          <p>{t("Manage procurement centre token queue.")}</p>
          {officerCentre && (
            <p>
              <strong>{officerCentre.centreName}</strong>
            </p>
          )}
        </div>
        <span className="live-badge">{t("● LIVE")}</span>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span>{t("Waiting")}</span>
          <strong>{waitingCount}</strong>
        </div>
        <div className="stat-card">
          <span>{t("Processing")}</span>
          <strong>{processingCount}</strong>
        </div>
        <div className="stat-card">
          <span>{t("Completed")}</span>
          <strong>{completedCount}</strong>
        </div>
        <div className="stat-card">
          <span>{t("Centre Capacity")}</span>
          <strong>72%</strong>
        </div>
      </div>

      <TokenQueueTable
        tokens={filteredTokens}
        officerCentre={officerCentre}
        onUpdateStatus={onUpdateStatus}
        getNextOfficerAction={getNextOfficerAction}
        t={t}
      />

      <CentreOperations t={t} />
    </main>
  );
}