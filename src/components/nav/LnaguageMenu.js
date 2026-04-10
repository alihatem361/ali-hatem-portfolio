"use client";

import React from "react";
import { FaEarthAfrica } from "react-icons/fa6";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";

function LnaguageMenu() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    window.localStorage.setItem("i18nextLng", language);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">
        {i18n.language === "en" ? "English" : "العربية"}
        <FaEarthAfrica
          style={{
            fontSize: "1.5rem",
            marginBottom: "0.2rem",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {i18n.language === "en" ? (
          <Dropdown.Item onClick={() => handleLanguageChange("ar")}>
            {t("language.arabic")}
          </Dropdown.Item>
        ) : (
          <Dropdown.Item onClick={() => handleLanguageChange("en")}>
            {t("language.english")}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LnaguageMenu;
