import React from "react";

export default function BuyerRegistration({
  buyerName,
  setBuyerName,
  buyerBusiness,
  setBuyerBusiness,
  loginMobile,
  setLoginMobile,
  buyerEmail,
  setBuyerEmail,
  buyerBusinessType,
  setBuyerBusinessType,
  buyerGstin,
  setBuyerGstin,
  buyerPan,
  setBuyerPan,
  buyerAddress,
  setBuyerAddress,
  onSubmit,
  onCancel,
  t,
}) {
  return (
    <>
      <div className="login-field">
        <label>{t("Owner / Contact Name")}</label>
        <input
          type="text"
          placeholder={t("Enter your name")}
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        />
      </div>

      <div className="login-field">
        <label>{t("Business / Company Name")}</label>
        <input
          type="text"
          placeholder={t("Enter business name")}
          value={buyerBusiness}
          onChange={(e) => setBuyerBusiness(e.target.value)}
        />
      </div>

      <div className="login-field">
        <label>{t("Registered Mobile Number")}</label>
        <input
          type="tel"
          maxLength="10"
          placeholder={t("10 digit mobile number")}
          value={loginMobile}
          onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <div className="login-field">
        <label>{t("Email Address")}</label>
        <input
          type="email"
          placeholder={t("Enter email address")}
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
        />
      </div>

      <div className="login-field">
        <label>{t("Business Type")}</label>
        <select
          value={buyerBusinessType}
          onChange={(e) => setBuyerBusinessType(e.target.value)}
        >
          <option value="">{t("Select business type")}</option>
          <option value="Trader">{t("Trader")}</option>
          <option value="Processor">{t("Processor")}</option>
          <option value="Wholesaler">{t("Wholesaler")}</option>
          <option value="Retailer">{t("Retailer")}</option>
          <option value="Other">{t("Other")}</option>
        </select>
      </div>

      <div className="login-field">
        <label>{t("GSTIN")}</label>
        <input
          type="text"
          placeholder={t("Enter GSTIN")}
          value={buyerGstin}
          onChange={(e) => setBuyerGstin(e.target.value.toUpperCase())}
        />
      </div>

      <div className="login-field">
        <label>{t("PAN")}</label>
        <input
          type="text"
          maxLength="10"
          placeholder={t("Enter PAN")}
          value={buyerPan}
          onChange={(e) => setBuyerPan(e.target.value.toUpperCase())}
        />
      </div>

      <div className="login-field">
        <label>{t("Business Address")}</label>
        <textarea
          rows="3"
          placeholder={t("Enter business address")}
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
        />
      </div>

      <button className="primary-button" onClick={onSubmit}>
        {t("Submit Registration")}
      </button>

      <button className="text-button" onClick={onCancel}>
        {t("Back to Buyer Login")}
      </button>
    </>
  );
}