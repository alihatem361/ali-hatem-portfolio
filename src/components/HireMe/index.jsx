import React from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaLinkedin, FaFileDownload } from "react-icons/fa";
import { getSocialsForLanguage } from "../../data/mergeProjects";
import { CV_FILES } from "../../data/cvTemplate";
import { track, trackSocialClick } from "../../helpers/analytics";
import PreviewCvModal from "../Auth/PreviewCvModal";
import "./style.css";

/**
 * Recruiter-facing contact block: a visible email address plus the three
 * actions that matter (email, LinkedIn, CV). The hero's "Contact me" button
 * links here via #hire. `placement` is reported with every click.
 */
const HireMe = ({ placement = "hire_block" }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  const socials = getSocialsForLanguage(i18n.language);
  const email = socials.find((s) => s.name === "email")?.link || "";
  const emailAddress = email.replace(/^mailto:/i, "");
  const linkedin = socials.find((s) => s.name === "linkedin")?.link;

  return (
    <section className="hire-block" id="hire" aria-labelledby="hire-title">
      <div className="hire-block__inner">
        <h2 className="hire-block__title" id="hire-title">
          {t("hire.title")}
        </h2>
        <p className="hire-block__text">{t("hire.text")}</p>

        {emailAddress && (
          <a
            className="hire-block__email"
            href={email}
            onClick={() => trackSocialClick("email", placement)}
          >
            {emailAddress}
          </a>
        )}

        <div className="hire-block__actions">
          {email && (
            <a
              className="hire-block__btn hire-block__btn--primary"
              href={email}
              onClick={() => trackSocialClick("email", placement)}
            >
              <FaEnvelope aria-hidden="true" />
              <span>{t("hire.email")}</span>
            </a>
          )}
          {linkedin && (
            <a
              className="hire-block__btn"
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackSocialClick("linkedin", placement)}
            >
              <FaLinkedin aria-hidden="true" />
              <span>{t("hire.linkedin")}</span>
            </a>
          )}
          <a
            className="hire-block__btn"
            href={CV_FILES[lang]}
            download
            onClick={() =>
              track("cv_download", { cv_language: lang, placement })
            }
          >
            <FaFileDownload aria-hidden="true" />
            <span>{t("cv.downloadButton")}</span>
          </a>
          <PreviewCvModal placement={placement} />
        </div>

        <p className="hire-block__meta">{t("hire.location")}</p>
      </div>
    </section>
  );
};

export default HireMe;
