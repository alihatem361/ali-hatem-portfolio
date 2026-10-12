import { useEffect, useState } from "react";
import SocialMedia from "../SocialMedia/index";
import "./style.css";
import GetAllData from "../../data/projects";
import { useTranslation } from "react-i18next";
import { sanityImage } from "../../helpers";
const Footer = () => {
  const { t, i18n } = useTranslation();
  const { getAboutme } = GetAllData();
  const [aboutmeData, setAboutmeData] = useState([]);

  useEffect(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
  }, [i18n.language]);

  return (
    <footer className="text-light footer" id="contact">
      <div className="row">
        <div className="col-lg-12 ">
          <div className="footer__Sosials">
            <div className="footer__Sosials__content" data-aos="fade-up">
              <div className="footer__Sosials__imag">
                <img
                  src={sanityImage(aboutmeData.footer, { width: 320 })}
                  alt={aboutmeData.name || "Ali Hatem"}
                  loading="lazy"
                />
              </div>
              <h2>{t("footer.footerName")} </h2>
              <h6>{t("footer.footerTitle")}</h6>
              <div className="footer__Sosials__icons">
                <SocialMedia placement="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
