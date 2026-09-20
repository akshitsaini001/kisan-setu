import React from "react";
import BuyerRegistration from "./BuyerRegistration";

export default function LoginForm({
  loginRole,
  loginId,
  setLoginId,
  loginMobile,
  setLoginMobile,
  loginOtp,
  setLoginOtp,
  otpSent,
  setOtpSent,
  adminPassword,
  setAdminPassword,
  sendLoginOtp,
  verifyLoginOtp,
  adminLogin,
  buyerRegisterMode,
  setBuyerRegisterMode,
  buyerRegistrationProps,
  onBack,
  language,
  changeLanguage,
  t,
}) {
  return (
    <main className="container login-container">
      <div className="login-topbar">
        <button className="back-button" onClick={onBack}>
          {t("← Back to roles")}
        </button>

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

      <div className="login-card">
        <div className="login-icon">
          {loginRole === "farmer" && "👨‍🌾"}
          {loginRole === "officer" && "🧑‍💼"}
          {loginRole === "buyer" && "🏢"}
          {loginRole === "admin" && "👑"}
        </div>

        <div className="eyebrow">
          {loginRole === "farmer" && t("FARMER LOGIN")}
          {loginRole === "officer" && t("PROCUREMENT OFFICER LOGIN")}
          {loginRole === "buyer" &&
            (buyerRegisterMode
              ? t("NEW BUYER REGISTRATION")
              : t("VERIFIED BUYER LOGIN"))}
          {loginRole === "admin" && t("ADMIN LOGIN")}
        </div>

        <h1>
          {loginRole === "farmer" && t("Welcome, Farmer")}
          {loginRole === "officer" && t("Officer Login")}
          {loginRole === "buyer" &&
            (buyerRegisterMode
              ? t("Register as a New Buyer")
              : t("Buyer Login"))}
          {loginRole === "admin" && t("Admin Login")}
        </h1>

        <p className="login-subtitle">
          {loginRole === "buyer" && buyerRegisterMode
            ? t("Create your buyer profile for Nova Farm.")
            : t("Login to access your Nova Farm dashboard.")}
        </p>

        {loginRole === "buyer" && buyerRegisterMode ? (
          <BuyerRegistration {...buyerRegistrationProps} t={t} />
        ) : (
          <>
            {/* FARMER / OFFICER / BUYER */}
            {loginRole !== "admin" && (
              <>
                <div className="login-field">
                  <label>
                    {loginRole === "farmer" && t("Farmer ID")}
                    {loginRole === "officer" && t("Officer ID")}
                    {loginRole === "buyer" && t("Buyer / Business ID")}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      loginRole === "farmer"
                        ? t("Enter Farmer ID")
                        : loginRole === "officer"
                        ? t("Enter Officer ID")
                        : t("Enter Buyer ID")
                    }
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label>{t("Registered Mobile Number")}</label>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder={t("10 digit mobile number")}
                    value={loginMobile}
                    onChange={(e) =>
                      setLoginMobile(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>

                {!otpSent ? (
                  <button className="primary-button" onClick={sendLoginOtp}>
                    {t("Send OTP")}
                  </button>
                ) : (
                  <>
                    <div className="otp-message">
                      {t("OTP sent to registered mobile number.")}
                    </div>

                    <div className="login-field">
                      <label>{t("Enter OTP")}</label>
                      <input
                        className="otp-input"
                        type="text"
                        maxLength="6"
                        placeholder={t("Enter 6 digit OTP")}
                        value={loginOtp}
                        onChange={(e) =>
                          setLoginOtp(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>

                    <button className="primary-button" onClick={verifyLoginOtp}>
                      {t("Verify OTP & Login")}
                    </button>

                    <button
                      className="text-button"
                      onClick={() => {
                        setOtpSent(false);
                        setLoginOtp("");
                      }}
                    >
                      {t("Change mobile number")}
                    </button>
                  </>
                )}

                <div className="demo-otp">
                  {t("Demo OTP:")} <strong>123456</strong>
                </div>
              </>
            )}

            {/* ADMIN LOGIN */}
            {loginRole === "admin" && (
              <>
                <div className="login-field">
                  <label>{t("Admin ID")}</label>
                  <input
                    type="text"
                    placeholder={t("Enter Admin ID")}
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label>{t("Password")}</label>
                  <input
                    type="password"
                    placeholder={t("Enter password")}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>

                <button className="primary-button" onClick={adminLogin}>
                  {t("Login as Admin")}
                </button>

                <div className="demo-otp">
                  <div>Demo Admin ID: <strong>ADMIN001</strong></div>
                  <div>Password: <strong>admin123</strong></div>
                </div>
              </>
            )}

            {loginRole === "buyer" && (
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "18px",
                  textAlign: "center",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <span style={{ color: "#6b7280" }}>
                  {t("Don't have an account?")}{" "}
                </span>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setBuyerRegisterMode(true);
                    setOtpSent(false);
                    setLoginOtp("");
                  }}
                >
                  {t("Register as a New Buyer →")}
                </button>
              </div>
            )}
          </>
        )}

        <div className="login-info">
          🔒 This is a prototype login. Real authentication will be connected
          during backend integration.
        </div>
      </div>
    </main>
  );
}