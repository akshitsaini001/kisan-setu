import React from "react";

export default function VoiceAssistantModal({ onClose, t = (text) => text }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "22px",
          padding: "28px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ fontSize: "52px", marginBottom: "10px" }}>🎙️</div>
        <div className="eyebrow">{t("Voice Assistant")}</div>
        <h2 style={{ margin: "8px 0 10px" }}>{t("AI Voice Assistant")}</h2>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>
          {t("Voice assistance will be available soon.")}
        </p>
        <button
          type="button"
          className="primary-button"
          style={{ width: "100%", marginBottom: "10px", opacity: 0.9 }}
          onClick={() => {}}
        >
          🎤 {t("Tap to Speak")}
        </button>
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "999px",
            background: "#f1f5f9",
            color: "#64748b",
            fontSize: "12px",
            marginBottom: "18px",
          }}
        >
          {t("Demo Feature")}
        </div>
        <button type="button" className="text-button" onClick={onClose}>
          {t("Close")}
        </button>
      </div>
    </div>
  );
}