import React from "react";
import logo from "../../assets/logo.svg";

export default function Header({
  loggedInRole,
  getRoleName,
  unreadNotificationCount,
  showNotifications,
  setShowNotifications,
  notifications,
  markAllNotificationsRead,
  markNotificationRead,
  showMenu,
  setShowMenu,
  showLanguageMenu,
  setShowLanguageMenu,
  language,
  changeLanguage,
  logout,
  setScreen,
  screen,
  t,
}) {
  return (
    <header className="header">
      <div>
        <div className="logo">
          <img className="logo-image" src={logo} alt="Nova Farm" />
          {t("Nova Farm")}
        </div>
        <div className="tagline">
          {t("Connecting Farmers, Buyers & Procurement Centres")}
        </div>
      </div>

      <div className="header-actions">
        {/* FARMER NOTIFICATION BELL */}
        {loggedInRole === "farmer" && (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="secondary-button header-button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowMenu(false);
                setShowLanguageMenu(false);
              }}
              aria-label="Notifications"
              style={{ position: "relative", minWidth: "48px" }}
            >
              🔔
              {unreadNotificationCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    minWidth: "20px",
                    height: "20px",
                    padding: "0 5px",
                    borderRadius: "999px",
                    background: "#dc2626",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #ffffff",
                  }}
                >
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION PANEL */}
            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: "min(360px, calc(100vw - 32px))",
                  maxHeight: "420px",
                  overflowY: "auto",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
                  zIndex: 1200,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: "4px 4px 10px",
                  }}
                >
                  <strong>{t("Notifications")}</strong>
                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      className="text-button"
                      onClick={markAllNotificationsRead}
                    >
                      {t("Mark all as read")}
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 12px",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    🔕 {t("No new notifications")}
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => markNotificationRead(notification.id)}
                      style={{
                        width: "100%",
                        border: "0",
                        borderRadius: "12px",
                        padding: "12px",
                        marginBottom: "7px",
                        textAlign: "left",
                        background: notification.read ? "#f8fafc" : "#eff6ff",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "9px",
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>
                          {notification.type === "Payment Completed"
                            ? "✅"
                            : notification.type === "Payment Processing"
                            ? "💳"
                            : notification.type === "Queue Approaching"
                            ? "🔔"
                            : notification.type === "Quality Check"
                            ? "🔍"
                            : notification.type === "Weighing"
                            ? "⚖️"
                            : notification.type === "Procurement Completed"
                            ? "✅"
                            : notification.type === "Procurement Started"
                            ? "🌾"
                            : "🎫"}
                        </span>
                        <span style={{ flex: 1 }}>
                          <strong
                            style={{
                              display: "block",
                              fontSize: "13px",
                              color: "#0f172a",
                              marginBottom: "3px",
                            }}
                          >
                            {t(notification.title)}
                          </strong>
                          <span
                            style={{
                              display: "block",
                              fontSize: "12px",
                              color: "#64748b",
                              lineHeight: 1.4,
                            }}
                          >
                            {t(notification.message)}
                          </span>
                          <span
                            style={{
                              display: "block",
                              marginTop: "5px",
                              fontSize: "10px",
                              color: "#94a3b8",
                            }}
                          >
                            {new Date(notification.time).toLocaleString()}
                          </span>
                        </span>
                        {!notification.read && (
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "#2563eb",
                              marginTop: "5px",
                            }}
                          />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ROLE NAME */}
        {loggedInRole && <span className="logged-role">{getRoleName()}</span>}

        {/* FARMER MENU */}
        {loggedInRole === "farmer" && (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="secondary-button header-button"
              onClick={() => {
                setShowMenu((prev) => !prev);
                setShowNotifications(false);
                setShowLanguageMenu(false);
              }}
              aria-label="Menu"
              style={{ minWidth: "48px", fontSize: "20px" }}
            >
              ☰
            </button>

            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: "250px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
                  zIndex: 1300,
                  padding: "8px",
                }}
              >
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    setScreen("token-history");
                  }}
                >
                  📋 <span>{t("Token History")}</span>
                </button>

                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    setShowLanguageMenu(false);
                    setShowNotifications(true);
                  }}
                >
                  🔔 <span style={{ flex: 1 }}>{t("Notifications")}</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      style={{
                        minWidth: "22px",
                        height: "22px",
                        padding: "0 6px",
                        borderRadius: "999px",
                        background: "#dc2626",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {unreadNotificationCount > 99
                        ? "99+"
                        : unreadNotificationCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    alert(t("Customer Support will be available here."));
                  }}
                >
                  🎧 <span>{t("Customer Support")}</span>
                </button>

                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="menu-item"
                    onClick={() => setShowLanguageMenu((prev) => !prev)}
                  >
                    🌐 <span style={{ flex: 1 }}>{t("Change Language")}</span>
                    <span>{showLanguageMenu ? "⌃" : "›"}</span>
                  </button>

                  {showLanguageMenu && (
                    <div
                      style={{
                        margin: "0 8px 8px 40px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        padding: "5px",
                      }}
                    >
                      <button
                        type="button"
                        className="menu-language-item"
                        onClick={() => {
                          changeLanguage("en");
                          setShowLanguageMenu(false);
                          setShowMenu(false);
                        }}
                      >
                        English {language === "en" && <span>✓</span>}
                      </button>
                      <button
                        type="button"
                        className="menu-language-item"
                        onClick={() => {
                          changeLanguage("hi");
                          setShowLanguageMenu(false);
                          setShowMenu(false);
                        }}
                      >
                        हिंदी {language === "hi" && <span>✓</span>}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    setShowLanguageMenu(false);
                    logout();
                  }}
                  style={{ color: "#dc2626" }}
                >
                  🚪 <span>{t("Logout")}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* NON-FARMER LOGOUT */}
        {loggedInRole && loggedInRole !== "farmer" && (
          <button className="secondary-button header-button" onClick={logout}>
            {t("Logout")}
          </button>
        )}

        {/* ROLE BUTTON WHEN NOT LOGGED IN */}
        {!loggedInRole && screen !== "roles" && (
          <button
            className="secondary-button header-button"
            onClick={() => setScreen("roles")}
          >
            {t("Roles")}
          </button>
        )}
      </div>
    </header>
  );
}