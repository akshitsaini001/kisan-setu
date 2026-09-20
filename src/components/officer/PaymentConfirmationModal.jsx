import React from "react";

export default function PaymentConfirmationModal({ token, rate, totalAmount, onConfirm, onClose, t }) {
  if (!token) return null;

  return (
    <div className="payment-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-modal-header">
          <div>
            <div className="eyebrow">{t("PAYMENT CONFIRMATION")}</div>
            <h2 id="payment-modal-title">{t("Confirm farmer payout")}</h2>
          </div>
          <button type="button" className="payment-modal-close" onClick={onClose} aria-label={t("Close")}>
            ×
          </button>
        </div>

        <div className="payment-summary-grid">
          <div><span>{t("Farmer")}</span><strong>{token.farmer}</strong></div>
          <div><span>{t("Crop")}</span><strong>{token.crop}</strong></div>
          <div><span>{t("Certified Actual Weight")}</span><strong>{token.actualQuantity ?? token.quantity} q</strong></div>
          <div><span>{t("Estimated Weight")}</span><strong>{token.quantity} q</strong></div>
          <div><span>{t("Applied Government MSP Rate")}</span><strong>₹{rate.toLocaleString()}/q</strong></div>
          <div className="payment-total"><span>{t("Total Payout Amount")}</span><strong>₹{totalAmount.toLocaleString()}</strong></div>
        </div>

        <div className="payment-modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>{t("Cancel")}</button>
          <button type="button" className="primary-button" onClick={onConfirm}>{t("Confirm & Disburse Payment")}</button>
        </div>
      </section>
    </div>
  );
}
