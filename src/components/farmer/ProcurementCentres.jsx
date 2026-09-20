import React from "react";
import { centres } from "../../constants/centers";

export default function ProcurementCentres({ onGenerateToken, onBack, t }) {
  return (
    <main className="container">
      <button className="back-button" onClick={onBack}>
        {t("← Back")}
      </button>

      <div className="welcome-card">
        <div>
          <div className="eyebrow">{t("PROCUREMENT CENTRES")}</div>
          <h1>{t("Choose a nearby centre")}</h1>
          <p>{t("Select a centre based on distance and current queue.")}</p>
        </div>
      </div>

      <div className="centre-list">
        {centres.map((centre) => (
          <div className="centre-card" key={centre.name}>
            <div className="centre-header">
              <div>
                <h2>{centre.name}</h2>
                <p>📍 {centre.distance}</p>
              </div>
              <span
                className={`status ${
                  centre.status === "Available" ? "available" : "busy"
                }`}
              >
                {t(centre.status)}
              </span>
            </div>

            <div className="stats">
              <div>
                <strong>{centre.waiting}</strong>
                <span>{t("Waiting")}</span>
              </div>
              <div>
                <strong>{centre.processing}</strong>
                <span>{t("Processing")}</span>
              </div>
              <div>
                <strong>{centre.waitTime}</strong>
                <span>{t("Est. Wait")}</span>
              </div>
              <div>
                <strong>{centre.capacity}%</strong>
                <span>{t("Capacity")}</span>
              </div>
            </div>

            <button
              className="primary-button"
              onClick={() => onGenerateToken(centre)}
            >
              {t("Book Token")}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}