import React from "react";
import { FaEarthAfrica } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { track } from "../../helpers/analytics";

function LnaguageMenu() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  const toggleLanguage = () => {
    const to = isEnglish ? "ar" : "en";
    track("language_switch", { from: i18n.language, to });
    i18n.changeLanguage(to);
  };

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={isEnglish ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      <FaEarthAfrica className="language-toggle__icon" aria-hidden="true" />
      <span className="language-toggle__label">
        {isEnglish ? "العربية" : "English"}
      </span>
    </button>
  );
}

export default LnaguageMenu;
