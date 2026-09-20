import { useLanguage } from "../../context/LanguageContext";

export const OptionsDrawer = ({
  open,
  loggedInRole,
  officerCentre,
  setScreen,
  setShowVoiceAssistant,
  logout,
  onClose,
}) => {
  const { language, changeLanguage, t } = useLanguage();

  const navigate = (nextScreen) => {
    setScreen(nextScreen);
    onClose();
  };

  const openVoiceAssistant = () => {
    setShowVoiceAssistant(true);
    onClose();
  };

  const roleLinks = {
    farmer: [
      { icon: "🌾", label: "Crop Comparison & Booking", screen: "home" },
      { icon: "🎫", label: "My Active Tokens", screen: "home" },
      { icon: "📜", label: "Previous Tokens", screen: "farmer-history" },
      { icon: "🏢", label: "Verified Market Demands", screen: "market" },
      { icon: "🎙️", label: "AI Voice Assistant", action: openVoiceAssistant },
    ],
    officer: [
      { icon: "🎫", label: "Live Token Queue", screen: "officer" },
      { icon: "📊", label: "Centre Operations Load", screen: "officer" },
      { icon: "🔄", label: "Refresh Queue", action: () => { alert(t("Queue refreshed")); onClose(); } },
    ],
    buyer: [
      { icon: "➕", label: "Post New Crop Demand", screen: "buyer" },
      { icon: "📋", label: "Manage Active Demands", screen: "buyer" },
      { icon: "📈", label: "Market Rates Overview", screen: "buyer" },
    ],
    admin: [
      { icon: "📈", label: "Platform Overview & Metrics", screen: "admin" },
      { icon: "🔎", label: "Pending Buyer Verifications", screen: "admin" },
      { icon: "🏛️", label: "Procurement Centres Status", screen: "admin" },
    ],
  };

  const links = roleLinks[loggedInRole] || [
    { icon: "🏠", label: "Choose Role", screen: "roles" },
    { icon: "ℹ️", label: "About Platform & MSP Support", screen: "roles" },
  ];

  return (
    <>
      <div
        className={`options-backdrop ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`options-drawer ${open ? "is-open" : ""}`}
        aria-label={t("Options")}
        aria-hidden={!open}
      >
        <div className="options-drawer-header">
          <div>
            <div className="eyebrow">{t("Quick actions")}</div>
            <h2>{t("Options")}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={t("Close")}>
            ×
          </button>
        </div>

        {loggedInRole === "officer" && officerCentre && (
          <div className="drawer-centre-badge">
            🏛️ <span>{officerCentre.centreName}</span>
          </div>
        )}

        <nav className="options-nav">
          {links.map((link) => (
            <button
              type="button"
              className="options-link"
              key={link.label}
              onClick={() => (link.action ? link.action() : navigate(link.screen))}
            >
              <span className="options-link-icon" aria-hidden="true">{link.icon}</span>
              <span>{t(link.label)}</span>
            </button>
          ))}
        </nav>

        <div className="drawer-divider" />
        <div className="drawer-language" aria-label={t("Language")}>{t("Language")}
          <div className="drawer-language-buttons">
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

        {loggedInRole && (
          <button type="button" className="drawer-logout" onClick={() => { logout(); onClose(); }}>
            ↪ {t("Logout")}
          </button>
        )}
      </aside>
    </>
  );
};
