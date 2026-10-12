import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaTimes, FaDownload, FaEye } from "react-icons/fa";
import { cvDataEN, cvDataAR } from "../../data/cvData";
import { CV_FILES } from "../../data/cvTemplate";
import { track } from "../../helpers/analytics";
import "./style.css";

function PreviewCvModal({ placement = "hero" }) {
  const [show, setShow] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const cvData = lang === "ar" ? cvDataAR : cvDataEN;

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    track("cv_preview_open", { cv_language: lang, placement });
  };
  const handleDownload = () =>
    track("cv_download", { cv_language: lang, placement: "cv_modal" });

  return (
    <div className="cv__modal">
      {/* Preview Button */}
      <button className="cv__modal__btn" onClick={handleShow}>
        <FaEye className="btn-icon" />
        <span>{t("cv.previewButton")}</span>
      </button>

      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="xl"
        className="cv-modal-clean cv-modal-fullwidth"
        backdrop="static"
      >
        {/* Simple Header */}
        <div className="cv-modal-header-clean">
          <span className="cv-modal-title-clean">{t("cv.modalTitle")}</span>
          <div className="cv-modal-actions">
            <a
              className="cv-action-btn download"
              href={CV_FILES[lang]}
              download
              onClick={handleDownload}
            >
              <FaDownload />
              <span>{t("cv.downloadButton")}</span>
            </a>
            <button className="cv-action-btn close" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        {/* CV Content - Simple White Design */}
        <Modal.Body className="cv-modal-body-clean">
          <div
            className="cv-paper"
            style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
          >
            {/* Header */}
            <header className="cv-header-simple">
              <h1>{cvData.personal.name}</h1>
              <p className="cv-title-text">{cvData.personal.title}</p>
              <div className="cv-contact-row">
                <span>{cvData.personal.email}</span>
                <span className="sep">|</span>
                <span>{cvData.personal.location}</span>
                <span className="sep">|</span>
                <span>{cvData.personal.phone}</span>
              </div>
              <div className="cv-contact-row">
                <a
                  href={cvData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <span className="sep">|</span>
                <a
                  href={cvData.personal.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>
                <span className="sep">|</span>
                <a
                  href={cvData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </header>

            {/* Objectives */}
            <section className="cv-section-simple">
              <h3>{lang === "ar" ? "الأهداف" : "OBJECTIVES"}</h3>
              <p>{cvData.objective}</p>
            </section>

            {/* Experience */}
            <section className="cv-section-simple">
              <h3>{lang === "ar" ? "الخبرات العملية" : "WORK EXPERIENCE"}</h3>
              {cvData.experience.map((exp, i) => (
                <div key={i} className="cv-exp-item">
                  <div className="cv-exp-header">
                    <strong>{exp.title}</strong>
                    <span className="cv-period">{exp.period}</span>
                  </div>
                  <div className="cv-company">
                    {exp.companyLink ? (
                      <a
                        href={exp.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span>{exp.company}</span>
                    )}
                    {exp.location && <span> • {exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="cv-desc">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="cv-highlights">
                      {exp.highlights.map((h, j) => (
                        <li key={j}>
                          {h.text}
                          {h.link && (
                            <a
                              href={h.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cv-link"
                            >
                              {h.linkText || "Demo"}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="cv-section-simple">
              <h3>{lang === "ar" ? "المهارات" : "SKILLS"}</h3>
              <p className="cv-skills-list">{cvData.skills.join(" • ")}</p>
            </section>

            {/* Education */}
            <section className="cv-section-simple">
              <h3>{lang === "ar" ? "التعليم" : "EDUCATION"}</h3>
              <div className="cv-exp-item">
                <div className="cv-exp-header">
                  <strong>{cvData.education.degree}</strong>
                  <span className="cv-period">{cvData.education.period}</span>
                </div>
                <div className="cv-company">
                  {cvData.education.university} • {cvData.education.location}
                </div>
                <p className="cv-desc">
                  <strong>{lang === "ar" ? "التخصص" : "Major"}:</strong>{" "}
                  {cvData.education.major} /
                  <strong> {lang === "ar" ? "التقدير" : "Grade"}:</strong>{" "}
                  {cvData.education.grade}
                </p>
              </div>
            </section>

            {/* Projects - 2 columns */}
            <section className="cv-section-simple">
              <h3>{lang === "ar" ? "المشاريع" : "PROJECTS"}</h3>
              <div className="cv-grid-2">
                {cvData.projects.map((proj, i) => (
                  <div key={i} className="cv-project-item">
                    <strong>{proj.title}</strong>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-link"
                      >
                        Link
                      </a>
                    )}
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-link"
                      >
                        GitHub
                      </a>
                    )}
                    <p>{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certificates - 2 columns */}
            <section className="cv-section-simple">
              <h3>{lang === "ar" ? "الشهادات" : "CERTIFICATES"}</h3>
              <div className="cv-grid-2">
                {cvData.certificates.map((cert, i) => (
                  <div key={i} className="cv-cert-item">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cert.title}
                    </a>
                    {cert.description && <span> - {cert.description}</span>}
                  </div>
                ))}
              </div>
            </section>

            {/* Volunteering */}
            {cvData.volunteering && cvData.volunteering.length > 0 && (
              <section className="cv-section-simple">
                <h3>{lang === "ar" ? "التطوع" : "VOLUNTEERING"}</h3>
                {cvData.volunteering.map((vol, i) => (
                  <div key={i} className="cv-exp-item">
                    <div className="cv-exp-header">
                      <strong>{vol.title}</strong>
                      <span className="cv-period">{vol.period}</span>
                    </div>
                    <div className="cv-company">{vol.organization}</div>
                  </div>
                ))}
              </section>
            )}

            {/* Awards */}
            <section className="cv-section-simple">
              <h3>{lang === "ar" ? "الجوائز" : "AWARDS"}</h3>
              {cvData.awards.map((award, i) => (
                <div key={i} className="cv-award-item">
                  <a
                    href={award.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-award-title"
                  >
                    {award.title}
                  </a>
                  <p>{award.description}</p>
                </div>
              ))}
            </section>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PreviewCvModal;
