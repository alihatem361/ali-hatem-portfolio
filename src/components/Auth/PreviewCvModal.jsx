import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaTimes, FaDownload, FaSpinner, FaEye } from "react-icons/fa";
import { cvDataEN, cvDataAR } from "../../data/cvData";
import html2pdf from "html2pdf.js";
import "./style.css";

// Generate CV HTML for PDF export
const generateCVHTML = (cvData, lang) => {
  const direction = lang === "ar" ? "rtl" : "ltr";
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 210mm; padding: 40px; background: white; color: #333; direction: ${direction}; box-sizing: border-box;">
      <header style="text-align: center; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 2px solid #d4af37;">
        <h1 style="font-size: 24px; font-weight: 700; color: #111; margin: 0 0 4px 0;">${cvData.personal.name}</h1>
        <p style="font-size: 13px; color: #555; font-style: italic; margin: 0 0 12px 0;">${cvData.personal.title}</p>
        <div style="font-size: 11px; color: #444; margin-bottom: 4px;">
          ${cvData.personal.email} | ${cvData.personal.location} | ${cvData.personal.phone}
        </div>
        <div style="font-size: 11px; color: #2563eb;">
          LinkedIn | Portfolio | GitHub
        </div>
      </header>

      <section style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #111; margin: 0 0 8px 0; padding-bottom: 3px; border-bottom: 2px solid #d4af37; display: inline-block;">${lang === "ar" ? "الأهداف" : "OBJECTIVES"}</h3>
        <p style="margin: 0; font-size: 12px; color: #444; text-align: justify;">${cvData.objective}</p>
      </section>

      <section style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #111; margin: 0 0 8px 0; padding-bottom: 3px; border-bottom: 2px solid #d4af37; display: inline-block;">${lang === "ar" ? "الخبرات العملية" : "WORK EXPERIENCE"}</h3>
        ${cvData.experience
          .map(
            (exp) => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong style="font-size: 12px; color: #222;">${exp.title}</strong>
              <span style="font-size: 11px; color: #666;">${exp.period}</span>
            </div>
            <div style="font-size: 11px; color: #555; font-style: italic; margin-bottom: 4px;">${exp.company}${exp.location ? " • " + exp.location : ""}</div>
            ${exp.description ? '<p style="margin: 4px 0 0 0; font-size: 11px; color: #444;">' + exp.description + "</p>" : ""}
          </div>
        `,
          )
          .join("")}
      </section>

      <section style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #111; margin: 0 0 8px 0; padding-bottom: 3px; border-bottom: 2px solid #d4af37; display: inline-block;">${lang === "ar" ? "المهارات" : "SKILLS"}</h3>
        <p style="font-size: 11px; color: #333; line-height: 1.6;">${cvData.skills.join(" • ")}</p>
      </section>

      <section style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #111; margin: 0 0 8px 0; padding-bottom: 3px; border-bottom: 2px solid #d4af37; display: inline-block;">${lang === "ar" ? "التعليم" : "EDUCATION"}</h3>
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <strong style="font-size: 12px; color: #222;">${cvData.education.degree}</strong>
          <span style="font-size: 11px; color: #666;">${cvData.education.period}</span>
        </div>
        <div style="font-size: 11px; color: #555; font-style: italic;">${cvData.education.university} • ${cvData.education.location}</div>
      </section>

      <section style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #111; margin: 0 0 8px 0; padding-bottom: 3px; border-bottom: 2px solid #d4af37; display: inline-block;">${lang === "ar" ? "المشاريع" : "PROJECTS"}</h3>
        ${cvData.projects
          .slice(0, 6)
          .map(
            (proj) => `
          <div style="margin-bottom: 8px;">
            <strong style="font-size: 11px; color: #222;">${proj.title}</strong>
            <p style="margin: 2px 0 0 0; font-size: 10px; color: #555;">${proj.description}</p>
          </div>
        `,
          )
          .join("")}
      </section>

      <section>
        <h3 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #111; margin: 0 0 8px 0; padding-bottom: 3px; border-bottom: 2px solid #d4af37; display: inline-block;">${lang === "ar" ? "الجوائز" : "AWARDS"}</h3>
        ${cvData.awards
          .map(
            (award) => `
          <div style="margin-bottom: 6px;">
            <strong style="font-size: 11px; color: #d4af37;">${award.title}</strong>
            <p style="margin: 2px 0 0 0; font-size: 10px; color: #444;">${award.description}</p>
          </div>
        `,
          )
          .join("")}
      </section>
    </div>
  `;
};

// Shared CV download function
export const downloadCV = async (lang = "en") => {
  const cvData = lang === "ar" ? cvDataAR : cvDataEN;
  const cvHTML = generateCVHTML(cvData, lang);

  const container = document.createElement("div");
  container.innerHTML = cvHTML;
  container.style.cssText =
    "position: fixed; left: -9999px; top: 0; background: white;";
  document.body.appendChild(container);

  // Get the actual CV element (first element child, not text node)
  const cvElement = container.querySelector("div");

  await new Promise((resolve) => setTimeout(resolve, 150));

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Ali-Hatem-Ramadan-CV-${lang.toUpperCase()}.pdf`,
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(opt).from(cvElement).save();
  document.body.removeChild(container);
};

function PreviewCvModal() {
  const [show, setShow] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const cvData = lang === "ar" ? cvDataAR : cvDataEN;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Download PDF using the shared function
  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      await downloadCV(lang);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
            <button
              className="cv-action-btn download"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              {isGenerating ? <FaSpinner className="spin" /> : <FaDownload />}
              <span>
                {isGenerating
                  ? lang === "ar"
                    ? "جاري..."
                    : "..."
                  : t("cv.downloadButton")}
              </span>
            </button>
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
