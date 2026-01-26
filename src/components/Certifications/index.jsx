import React from "react";
import "./style.css";
import { useTranslation } from "react-i18next";
import { cvDataEN, cvDataAR } from "../../data/cvData";
import {
  FaCertificate,
  FaTrophy,
  FaExternalLinkAlt,
  FaMedal,
  FaAward,
  FaGraduationCap,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BsPatchCheckFill } from "react-icons/bs";

const Certifications = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const cvData = isArabic ? cvDataAR : cvDataEN;
  const certificates = cvData.certificates;
  const awards = cvData.awards;

  return (
    <div className="certifications-container" data-aos="fade-up">
      {/* Background Decorations */}
      <div className="certifications-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      {/* Header */}
      <div className="certifications-header">
        <div className="header-badge">
          <FaCertificate className="badge-icon" />
          <span>{t("certifications.badge")}</span>
        </div>
        <h2>{t("certifications.title")}</h2>
        <p className="certifications-subtitle">
          {t("certifications.subtitle")}
        </p>
        <div className="certifications-divider"></div>
      </div>

      {/* Content Grid */}
      <div className="certifications-content">
        {/* Certificates Section */}
        <div className="certs-section" data-aos="fade-up" data-aos-delay="100">
          <div className="section-label">
            <FaGraduationCap className="section-icon" />
            <h3>{t("certifications.certificatesLabel")}</h3>
          </div>

          <div className="certs-grid">
            {certificates.map((cert, index) => (
              <div
                className="cert-card"
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 50}
              >
                {/* Card Icon */}
                <div className="cert-icon-wrapper">
                  <BsPatchCheckFill className="cert-icon" />
                  <div className="cert-glow"></div>
                </div>

                {/* Card Content */}
                <div className="cert-content">
                  <h4 className="cert-title">{cert.title}</h4>
                  {cert.issuer && (
                    <span className="cert-issuer">{cert.issuer}</span>
                  )}
                  {cert.description && (
                    <p className="cert-description">{cert.description}</p>
                  )}
                </div>

                {/* View Link */}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="cert-link"
                  >
                    <span>{t("certifications.viewCertificate")}</span>
                    <FaExternalLinkAlt className="link-icon" />
                  </a>
                )}

                {/* Hover Effect */}
                <div className="cert-hover-bg"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="awards-section" data-aos="fade-up" data-aos-delay="200">
          <div className="section-label">
            <FaTrophy className="section-icon trophy" />
            <h3>{t("certifications.awardsLabel")}</h3>
          </div>

          <div className="awards-grid">
            {awards.map((award, index) => (
              <div
                className="award-card"
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 50}
              >
                {/* Trophy Icon */}
                <div className="award-icon-wrapper">
                  <FaMedal className="award-icon" />
                  <div className="award-glow"></div>
                  <HiSparkles className="sparkle sparkle-1" />
                  <HiSparkles className="sparkle sparkle-2" />
                </div>

                {/* Card Content */}
                <div className="award-content">
                  <div className="award-badge">
                    <FaAward className="award-badge-icon" />
                    <span>{t("certifications.winner")}</span>
                  </div>
                  <h4 className="award-title">{award.title}</h4>
                  {award.description && (
                    <p className="award-description">{award.description}</p>
                  )}
                </div>

                {/* View Link */}
                {award.link && (
                  <a
                    href={award.link}
                    target="_blank"
                    rel="noreferrer"
                    className="award-link"
                  >
                    <span>{t("certifications.viewAward")}</span>
                    <FaExternalLinkAlt className="link-icon" />
                  </a>
                )}

                {/* Decorative Elements */}
                <div className="award-confetti"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
