import { CROPS } from "../../constants/crops";

const DEFAULT_MSP_RATE = 2585;

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = date.getHours();
  const hour12 = String(hours % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";
  return `${day}/${month}/${date.getFullYear()}, ${hour12}:${minutes} ${meridiem}`;
};

const getCrop = (name) => CROPS.find((crop) => crop.name === name);

export const FarmerTokenHistory = ({ loginId, setScreen, tokens = [], t }) => {
  const history = tokens
    .filter((token) => token.farmer === loginId)
    .sort((firstToken, secondToken) => {
      const firstTime = new Date(firstToken.createdAt || 0).getTime();
      const secondTime = new Date(secondToken.createdAt || 0).getTime();
      return secondTime - firstTime;
    });

  return (
    <main className="container token-history-page">
      <button className="back-button" onClick={() => setScreen("home")}>
        {t("← Back to Dashboard")}
      </button>

      <div className="welcome-card">
        <div className="eyebrow">{t("PREVIOUS TOKENS")}</div>
        <h1>📜 {t("Previous Token History")}</h1>
        <p>{t("Review tokens booked with this Farmer ID.")}</p>
      </div>

      {history.length === 0 && (
        <div className="history-empty">
          <div className="history-empty-icon">📭</div>
          <strong>{t("No previous tokens found for this Farmer ID.")}</strong>
          <p>{loginId}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="token-history-list">
          {history.map((token) => {
            const crop = getCrop(token.crop);
            const latestEvent = token.history?.[token.history.length - 1];
            const statusClass = token.status.toLowerCase().replaceAll(" ", "-");

            return (
              <article className="history-token-card" key={token.id}>
                <div className="history-token-header">
                  <div>
                    <div className="eyebrow">{t("TOKEN")}</div>
                    <h2>{token.id}</h2>
                  </div>
                  <span className={`history-status ${statusClass}`}>{t(token.status)}</span>
                </div>

                <div className="history-token-grid">
                  <div><span>{t("Booking Date & Time")}</span><strong>{formatDateTime(token.createdAt)}</strong></div>
                  <div><span>{t("Crop")}</span><strong>{crop?.emoji || "🌾"} {token.crop} {crop?.hindi ? `(${crop.hindi})` : ""}</strong></div>
                  <div><span>{t("Estimated Weight")}</span><strong>{token.quantity} q</strong></div>
                  <div><span>{t("Actual Weight")}</span><strong>{token.actualQuantity == null ? t("Not recorded") : `${token.actualQuantity} q`}</strong></div>
                  <div><span>{t("Government MSP")}</span><strong>₹{DEFAULT_MSP_RATE.toLocaleString()}/q</strong></div>
                  <div><span>{t("Payout Value")}</span><strong>₹{Number(token.totalAmount ?? ((token.actualQuantity ?? token.quantity) * (token.rate ?? DEFAULT_MSP_RATE))).toLocaleString()}</strong></div>
                  <div><span>{t("Applied Rate")}</span><strong>₹{(token.rate ?? DEFAULT_MSP_RATE).toLocaleString()}/q</strong></div>
                  <div className="history-token-wide"><span>{t("Procurement Centre")}</span><strong>📍 {token.centre}</strong></div>
                </div>

                <div className="history-timeline">
                  <span>{t("Status History")}</span>
                  <div className="history-timeline-events">
                    {(token.history || []).slice(-4).map((event) => (
                      <div className="history-event" key={`${event.status}-${event.time}`}>
                        <i />
                        <strong>{t(event.status)}</strong>
                        <small>{formatDateTime(event.time)}</small>
                      </div>
                    ))}
                    {latestEvent && <small className="history-last-update">{t("Last updated")}: {formatDateTime(latestEvent.time)}</small>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};
