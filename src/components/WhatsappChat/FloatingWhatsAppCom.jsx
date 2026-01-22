import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { useEffect, useState } from "react";
import GetAllData from "../../data/projects.jsx";
import { useTranslation } from "react-i18next";
const FloatingWhatsAppCom = () => {
  const { getProjects, getSocials, getAboutme } = GetAllData();
  const { t, i18n } = useTranslation();

  const [aboutmeData, setAboutmeData] = useState([]);
  useEffect(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
  }, [i18n.language]);

  return (
    <div>
      <FloatingWhatsApp
        phoneNumber="+201026159353"
        accountName={aboutmeData.name}
        avatar={aboutmeData.headerImage}
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
    </div>
  );
};

export default FloatingWhatsAppCom;
