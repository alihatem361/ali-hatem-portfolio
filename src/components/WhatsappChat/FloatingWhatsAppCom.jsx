import React from "react";
import { useEffect, useState } from "react";
import GetAllData from "../../data/projects.jsx";
import { useTranslation } from "react-i18next";
import { sanityImage } from "../../helpers";
import { track } from "../../helpers/analytics";
const FloatingWhatsAppCom = () => {
  const { getProjects, getSocials, getAboutme } = GetAllData();
  const { t, i18n } = useTranslation();

  const [aboutmeData, setAboutmeData] = useState([]);
  useEffect(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
  }, [i18n.language]);

  // Client-only and loaded on demand: the library embeds ~300 KB of base64
  // images, which would otherwise sit in the main bundle and be baked into
  // the prerendered homepage HTML.
  const [FloatingWhatsApp, setFloatingWhatsApp] = useState(null);
  useEffect(() => {
    import("react-floating-whatsapp").then((module) =>
      setFloatingWhatsApp(() => module.FloatingWhatsApp),
    );
  }, []);
  if (!FloatingWhatsApp) return null;

  return (
    <div>
      <FloatingWhatsApp
        phoneNumber="+201026159353"
        accountName={aboutmeData.name}
        avatar={sanityImage(aboutmeData.headerImage, { width: 120 })}
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
        onSubmit={() =>
          track("contact_click", {
            method: "whatsapp",
            placement: "whatsapp_widget",
          })
        }
      />
    </div>
  );
};

export default FloatingWhatsAppCom;
