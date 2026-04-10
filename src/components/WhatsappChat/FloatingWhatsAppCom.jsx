"use client";

import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { useEffect, useState } from "react";
import GetAllData from "../../data/projects.js";
import { useTranslation } from "react-i18next";
import { resolvePublicAssetPath } from "../../helpers";
const FloatingWhatsAppCom = () => {
  const { getAboutme } = GetAllData();
  const { i18n } = useTranslation();

  const [aboutmeData, setAboutmeData] = useState([]);
  useEffect(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <div>
      {aboutmeData?.heaaderimag && aboutmeData?.name ? (
        <FloatingWhatsApp
          phoneNumber="+201026159353"
          accountName={aboutmeData.name}
          avatar={resolvePublicAssetPath(aboutmeData.heaaderimag)}
          chatMessage={
            i18n.language === "en"
              ? "Hello, how can I help you?"
              : "مرحبا كيف يمكنني مساعدتك؟"
          }
          darkMode={false}
          statusMessage={i18n.language === "en" ? "Online" : "متصل"}
          placeholder={
            i18n.language === "en" ? "Type a message..." : "اكتب رسالة..."
          }
          allowClickAway={true}
          allowEsc={true}
        />
      ) : null}
    </div>
  );
};

export default FloatingWhatsAppCom;
