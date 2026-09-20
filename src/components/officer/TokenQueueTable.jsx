import React, { useState } from "react";
import PaymentConfirmationModal from "./PaymentConfirmationModal";

const DEFAULT_MSP_RATE = 2585;

export default function TokenQueueTable({
  tokens,
  officerCentre,
  onUpdateStatus,
  getNextOfficerAction,
  t,
}) {
  const [verifiedWeights, setVerifiedWeights] = useState({});
  const [paymentToken, setPaymentToken] = useState(null);

  const submitStatusUpdate = (token) => {
    if (token.status === "Completed") {
      setPaymentToken(token);
      return;
    }
    onUpdateStatus(token.id, verifiedWeights[token.id]);
  };

  const paymentRate = paymentToken?.rate || DEFAULT_MSP_RATE;
  const paymentQuantity = paymentToken?.actualQuantity ?? paymentToken?.quantity ?? 0;
  const paymentTotal = paymentQuantity * paymentRate;

  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <h2>{t("🎫 Token Queue")}</h2>
          <p>{officerCentre?.centreName || "Procurement Centre"}</p>
        </div>
        <button
          className="small-button"
          onClick={() => alert(t("Queue refreshed"))}
        >
          {t("Refresh")}
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{t("Token")}</th>
              <th>{t("Farmer")}</th>
              <th>{t("Crop")}</th>
              <th>{t("Quantity")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.id}>
                <td>
                  <strong>{token.id}</strong>
                </td>
                <td>{token.farmer}</td>
                <td>{token.crop}</td>
                <td>{token.quantity} q</td>
                <td>
                  <span
                    className={`table-status ${token.status.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {t(token.status)}
                  </span>
                </td>
                <td>
                  {token.status === "Weighing" && (
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={verifiedWeights[token.id] || ""}
                      placeholder={t("Actual weight (q)")}
                      onChange={(event) =>
                        setVerifiedWeights((previous) => ({
                          ...previous,
                          [token.id]: event.target.value,
                        }))
                      }
                      style={{ width: "130px", marginRight: "8px" }}
                    />
                  )}
                  {token.status !== "Payment Completed" && (
                    <button
                      className="action-button"
                      onClick={() => submitStatusUpdate(token)}
                    >
                      {t(getNextOfficerAction(token.status))}
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {tokens.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  {t("No tokens available for this centre.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaymentConfirmationModal
        token={paymentToken}
        rate={paymentRate}
        totalAmount={paymentTotal}
        onClose={() => setPaymentToken(null)}
        onConfirm={() => {
          onUpdateStatus(paymentToken.id, undefined, paymentTotal);
          setPaymentToken(null);
        }}
        t={t}
      />
    </div>
  );
}