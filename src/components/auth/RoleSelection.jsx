import React from "react";

export default function RoleSelection({ onSelectRole, language, changeLanguage, t }) {
  return (
    <main className="container">
      <div className="role-topbar">
        <span className="eyebrow">{t("Choose your role")}</span>
        <div className="language-switch" aria-label={t("Change Language")}>
          <button
            type="button"
            className={`language-button ${language === "en" ? "active" : ""}`}
            onClick={() => changeLanguage("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`language-button ${language === "hi" ? "active" : ""}`}
            onClick={() => changeLanguage("hi")}
          >
            हिंदी
          </button>
        </div>
      </div>

      <div className="welcome-card">
        <div>
          <div className="eyebrow">{t("NOVA FARM PLATFORM")}</div>
          <h1>{t("Choose your role")}</h1>
          <p>{t("Select how you want to access the Nova Farm platform.")}</p>
        </div>
      </div>

      <div className="role-grid">
        <button className="role-button" onClick={() => onSelectRole("farmer")}>
          <div className="role-icon">👨‍🌾</div>
          <div>
            <h3>{t("Farmer")}</h3>
            <p>{t("Sell your crop, compare options and book procurement tokens.")}</p>
          </div>
        </button>

        <button className="role-button" onClick={() => onSelectRole("officer")}>
          <div className="role-icon">🧑‍💼</div>
          <div>
            <h3>{t("Procurement Officer")}</h3>
            <p>{t("Manage token queue and crop procurement operations.")}</p>
          </div>
        </button>

        <button className="role-button" onClick={() => onSelectRole("buyer")}>
          <div className="role-icon">🏢</div>
          <div>
            <h3>{t("Verified Buyer")}</h3>
            <p>{t("Create crop demand and connect with farmers.")}</p>
          </div>
        </button>

        <button className="role-button" onClick={() => onSelectRole("admin")}>
          <div className="role-icon">👑</div>
          <div>
            <h3>{t("Admin")}</h3>
            <p>{t("Manage users, verification and platform monitoring.")}</p>
          </div>
        </button>
      </div>

      <div className="info-card">
        <strong>{t("🔐 Secure access")}</strong>
        <p>{t("Each role has its own login and dashboard.")}</p>
      </div>
    </main>
  );
}