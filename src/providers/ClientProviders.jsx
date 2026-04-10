"use client";

import { useEffect, useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { useTranslation } from "react-i18next";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AOS from "aos";
import store from "../store";
import "../i18n";

function RuntimeEffects() {
  const { i18n } = useTranslation();

  useLayoutEffect(() => {
    const savedLanguage = window.localStorage.getItem("i18nextLng");

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return null;
}

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <RuntimeEffects />
      {children}
      <SpeedInsights />
    </Provider>
  );
}
