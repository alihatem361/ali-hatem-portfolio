import React from "react";
import { useTranslation } from "react-i18next";
import SocialMedia from "../SocialMedia/index";
import CV from "../../assets/Ali_Hatem_Ramadan_Resume.pdf";
import { handleDownloadCv } from "../../helpers/index";
import PreviewCvModal from "../Auth/PreviewCvModal";
import { FaFileDownload } from "react-icons/fa";
const HeaderBio = ({ aboutmeData }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="header-text " data-aos="fade-up">
      <div>
        <h4>{i18n.language === "en" ? "Hi👋" : "مرحبا 👋"}</h4>
        <h2>
          {i18n.language === "en" ? "I'm" : "أنا"} {aboutmeData.name} 👨‍💻
        </h2>
        <p>
          {aboutmeData.bio &&
            aboutmeData.bio.map((item) => {
              return (
                <span>
                  {item}
                  <br />
                </span>
              );
            })}
        </p>

        <div className="header-buttons d-flex justify-content-start gap-3">
          <button
            className="btn"
            onClick={() => handleDownloadCv(CV, "Ali_Hatem_Ramadan_Resume")}
          >
            CV{" "}
            <FaFileDownload
              style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}
            />
          </button>
          <PreviewCvModal />
        </div>
      </div>

      <div className="header-social">
        <SocialMedia />
      </div>
    </div>
  );
};

export default HeaderBio;
