import React from "react";
import { crops } from "../../constants/crops";

export default function CropCards({ value, onChange, t = (text) => text }) {
  return (
    <div className="crop-selection">
      <label>{t("Select Crop")}</label>
      <div className="crop-grid">
        {crops.map((item) => (
          <button
            type="button"
            key={item.name}
            className={`crop-card ${value === item.name ? "selected" : ""}`}
            onClick={() => onChange(item.name)}
          >
            <span className="crop-emoji">{item.emoji}</span>
            <span className="crop-name">{item.name}</span>
            <span className="crop-hindi">{item.hindi}</span>
            {value === item.name && <span className="crop-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}