import { useEffect, useState } from "react";
import SocialMedia from "../SocialMedia/index";
import "./style.css";
import GetAllData from "../../data/projects";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t, i18n } = useTranslation();
  const { getProjects, getSocials, getAboutme } = GetAllData();
  const [aboutmeData, setAboutmeData] = useState([]);
  const [socialsData, setSocialsData] = useState([]);

  useEffect(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });

    getSocials().then((data) => {
      setSocialsData(data);
    });
  }, [i18n.language]);

  return (
    <div className=" text-light footer">
      <div className="row">
        <div className="col-lg-12 ">
          <div className="footer__Sosials">
            <div className="footer__Sosials__content" data-aos="fade-up">
              <div className="footer__Sosials__imag">
                <img src={aboutmeData.footer} alt="social" />
              </div>
              <h2>{t("footer.footerName")} </h2>
              <h6>{t("footer.footerTitle")}</h6>
              <div className="footer__Sosials__icons">
                <SocialMedia socials={socialsData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
