"use client";

import React from "react";
import { FaEarthAfrica } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

function LnaguageMenu() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const toggleLanguage = () => {
    const next = isAr ? "en" : "ar";
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
    window.localStorage.setItem("i18nextLng", next);
  };

  return (
    <button
      className="lang-toggle-btn"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title={isAr ? "Switch to English" : "التبديل إلى العربية"}
    >
      <FaEarthAfrica className="lang-toggle-icon" />
      <span className={!isAr ? "lang-opt lang-opt--active" : "lang-opt"}>
        EN
      </span>
      <span className="lang-toggle-sep">|</span>
      <span className={isAr ? "lang-opt lang-opt--active" : "lang-opt"}>ع</span>
    </button>
  );
}

export default LnaguageMenu;
