import React from "react";
import { FaEarthAfrica } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

function LnaguageMenu() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    console.log(`Switching to ${newLanguage === "ar" ? "Arabic" : "English"}`);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      className="button1 language-toggle"
      onClick={toggleLanguage}
      style={{
        position: "relative",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        minWidth: "120px",
        whiteSpace: "nowrap",
        border: "1px solid var(--accent-color)",
        background: "rgba(212, 175, 55, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "var(--transition)",
        borderRadius: "20px",
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        fontWeight: "500",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      <span style={{ fontWeight: "500" }}>
        {i18n.language === "en" ? "English" : "العربية"}
      </span>
      <FaEarthAfrica
        style={{
          fontSize: "1.2rem",
          color: "var(--accent-color)",
        }}
      />
    </button>
  );
}

export default LnaguageMenu;
