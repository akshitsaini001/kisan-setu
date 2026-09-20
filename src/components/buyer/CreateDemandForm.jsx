import React from "react";
import CropCards from "../common/CropCards";

export default function CreateDemandForm({
  buyerCrop,
  setBuyerCrop,
  buyerQuantity,
  setBuyerQuantity,
  buyerRate,
  setBuyerRate,
  buyerLocation,
  setBuyerLocation,
  onSubmit,
  t,
}) {
  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <h2>{t("➕ Create New Demand")}</h2>
          <p>{t("Tell farmers what crop you need.")}</p>
        </div>
      </div>

      <div className="form-grid">
        <CropCards value={buyerCrop} onChange={setBuyerCrop} t={t} />

        <div className="login-field">
          <label>{t("Required Quantity (Quintal)")}</label>
          <input
            type="number"
            placeholder={t("Example: 100")}
            value={buyerQuantity}
            onChange={(e) => setBuyerQuantity(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>{t("Offered Rate / Quintal")}</label>
          <input
            type="number"
            placeholder={t("Example: 2700")}
            value={buyerRate}
            onChange={(e) => setBuyerRate(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>{t("Location")}</label>
          <input
            type="text"
            placeholder={t("Example: Lucknow")}
            value={buyerLocation}
            onChange={(e) => setBuyerLocation(e.target.value)}
          />
        </div>
      </div>

      <button className="primary-button" onClick={onSubmit}>
        {t("Publish Demand")}
      </button>
    </div>
  );
}