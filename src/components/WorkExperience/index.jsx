import React from "react";
import "./style.css";
import { useTranslation } from "react-i18next";
import { cvDataEN, cvDataAR } from "../../data/cvData";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaBuilding,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const WorkExperience = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const cvData = isArabic ? cvDataAR : cvDataEN;
  const experience = cvData.experience;

  return (
    <div className="experience-container" data-aos="fade-up">
      {/* Background Decorations */}
      <div className="experience-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      {/* Header */}
      <div className="experience-header">
        <div className="header-badge">
          <FaBriefcase className="badge-icon" />
          <span>{t("experience.badge")}</span>
        </div>
        <h2>{t("experience.title")}</h2>
        <p className="experience-subtitle">{t("experience.subtitle")}</p>
        <div className="experience-divider"></div>
      </div>

      {/* Timeline */}
      <div className="experience-content">
        <div className="experience-timeline">
          {experience.map((job, index) => (
            <div
              className="timeline-item"
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Timeline Line & Dot */}
              <div className="timeline-line">
                <div className="timeline-dot">
                  <FaBriefcase className="dot-icon" />
                </div>
              </div>

              {/* Job Card */}
              <div className="job-card">
                {/* Current Job Badge */}
                {index === 0 && (
                  <div className="current-badge">
                    <HiSparkles className="sparkle-icon" />
                    <span>{t("experience.current")}</span>
                  </div>
                )}

                {/* Job Header */}
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-company">
                    <FaBuilding className="company-icon" />
                    {job.companyLink ? (
                      <a
                        href={job.companyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="company-link"
                      >
                        {job.company}
                        <FaExternalLinkAlt className="external-icon" />
                      </a>
                    ) : (
                      <span>{job.company}</span>
                    )}
                  </div>
                </div>

                {/* Job Meta */}
                <div className="job-meta">
                  {job.location && (
                    <div className="meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span>{job.period}</span>
                  </div>
                </div>

                {/* Job Description */}
                {job.description && (
                  <p className="job-description">{job.description}</p>
                )}

                {/* Highlights */}
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="job-highlights">
                    {job.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="highlight-item">
                        <span className="highlight-bullet">▸</span>
                        <span className="highlight-text">
                          {highlight.text}
                          {highlight.link && (
                            <a
                              href={highlight.link}
                              target="_blank"
                              rel="noreferrer"
                              className="highlight-link"
                            >
                              {highlight.linkText || "Demo"}
                              <FaExternalLinkAlt className="link-icon" />
                            </a>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Hover Effect */}
                <div className="card-glow"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
