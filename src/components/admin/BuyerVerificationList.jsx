import React from "react";

export default function BuyerVerificationList({ t }) {
  const pendingBuyers = [
    { id: 1, name: "Agro Bharat Pvt Ltd", gst: "GST: 09ABCDE1234F1Z5" },
    { id: 2, name: "Lucknow Grain Traders", gst: "GST: 09XYZAB5678K1Z2" },
  ];

  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <h2>{t("🔎 Buyer Verification")}</h2>
          <p>{t("Pending business verification requests.")}</p>
        </div>
      </div>

      <div className="verification-list">
        {pendingBuyers.map((buyer) => (
          <div className="verification-row" key={buyer.id}>
            <div>
              <strong>{buyer.name}</strong>
              <span>{buyer.gst}</span>
            </div>
            <span className="pending">{t("Pending")}</span>
            <button
              className="action-button"
              onClick={() => alert(t("Buyer verification approved"))}
            >
              {t("Review")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}