import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProjectCardButtons from "./ProjectCardButtons";
import { PiShootingStarBold } from "react-icons/pi";
import { IoRocket } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import YoutubeVideo from "./YoutubeVideo";
import LoomVideo from "./LoomVideo";

const ProjectOffcanvas = ({ show, project, handleClose }) => {
  const { i18n } = useTranslation();
  const placement = i18n.language === "en" ? "start" : "end";

  return (
    <React.Fragment>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement={placement}
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          width: "100vw", // Full viewport width
          height: "100vh", // Full viewport height
          maxWidth: "none", // Remove max width restriction
          borderRadius: "0", // Remove border radius for full screen
          border: "none",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "9999",
        }}
        className="text-capitalize custom-offcanvas enhanced-offcanvas"
      >
        <Offcanvas.Header
          closeButton
          className="enhanced-header"
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "2rem",
            background:
              "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="header-content w-100">
            <h1
              className="project-offcanvas-title text-capitalize mb-0"
              style={{
                fontSize: "2.8rem",
                fontWeight: "800",
                background:
                  "linear-gradient(45deg, #fff 30%, var(--warning-color) 70%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
                lineHeight: "1.2",
              }}
            >
              {project.title || "Project Details"}
            </h1>
            {project.category && (
              <span
                className="project-category"
                style={{
                  display: "inline-block",
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 193, 7, 0.2)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "var(--warning-color)",
                }}
              >
                {project.category}
              </span>
            )}
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body className="enhanced-body" style={{ padding: "2.5rem" }}>
          {/* Media Container with Enhanced Styling */}
          <div
            className="media-container w-100 mb-4"
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
              background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {project.loomVideo ? (
              <LoomVideo videoUrl={project.loomVideo} />
            ) : null}
            <YoutubeVideo project={project} />
            {project.videoKey || project.loomVideo ? null : (
              <LazyLoadImage
                src={project.imeg || ""}
                alt={project.title || "Project Image"}
                effect="blur"
                className="card-img-top w-100"
                placeholderSrc={project.imeg || ""}
                style={{
                  maxHeight: "400px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            )}
          </div>

          {/* Technology Section with Enhanced Design */}
          <div className="technology-section mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2
                className="section-title text-capitalize d-flex align-items-center gap-3"
                style={{
                  fontSize: "2.4rem",
                  fontWeight: "700",
                  color: "#fff",
                  margin: "0",
                }}
              >
                <span>Technologies Used</span>
                <PiShootingStarBold
                  className="text-warning"
                  style={{
                    fontSize: "2rem",
                    filter: "drop-shadow(0 0 10px rgba(255, 193, 7, 0.5))",
                  }}
                />
              </h2>

              {project.codeStatus === "PRIVATE" && (
                <span
                  className="status-badge private-badge"
                  style={{
                    fontSize: "1.2rem",
                    background:
                      "linear-gradient(135deg, var(--danger-color), #ff6b6b)",
                    boxShadow: "0 8px 25px rgba(220, 53, 69, 0.3)",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "25px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {i18n.language === "en" ? "Private Repository" : "مستودع خاص"}
                  <FaLock style={{ fontSize: "1rem" }} />
                </span>
              )}
            </div>

            {/* Technology Badges with Enhanced Styling */}
            <div className="tech-badges-container d-flex justify-content-start flex-wrap gap-3">
              {project.technology?.map((tech, index) => (
                <span
                  key={index}
                  className="tech-badge-enhanced"
                  style={{
                    color: "white",
                    borderRadius: "20px",
                    padding: "12px 20px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    background:
                      "linear-gradient(135deg, var(--tertiary-color), #3a3a3a)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "default",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px) scale(1.05)";
                    e.target.style.boxShadow =
                      "0 12px 30px rgba(255, 193, 7, 0.3)";
                    e.target.style.background =
                      "linear-gradient(135deg, var(--warning-color), #f39c12)";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
                    e.target.style.background =
                      "linear-gradient(135deg, var(--tertiary-color), #3a3a3a)";
                    e.target.style.color = "white";
                  }}
                >
                  #{tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description Section with Enhanced Styling */}
          <div className="description-section mb-4">
            <h3
              className="section-title text-capitalize d-flex align-items-center gap-3 mb-3"
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#fff",
                margin: "0",
              }}
            >
              <span>Project Description</span>
              <IoRocket
                className="text-warning"
                style={{
                  fontSize: "1.8rem",
                  filter: "drop-shadow(0 0 10px rgba(255, 193, 7, 0.5))",
                }}
              />
            </h3>

            <div
              className="description-card"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "2rem",
                backdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  left: "0",
                  top: "0",
                  height: "100%",
                  width: "4px",
                  background:
                    "linear-gradient(180deg, var(--warning-color), transparent)",
                  borderRadius: "0 20px 20px 0",
                }}
              />
              <p
                className="description-text"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "1.3rem",
                  fontWeight: "400",
                  lineHeight: "1.8",
                  margin: "0",
                  paddingLeft: "1rem",
                }}
              >
                {project.description ||
                  "No description available for this project."}
              </p>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div
            className="action-buttons-container"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "1.5rem",
              backdropFilter: "blur(20px)",
            }}
          >
            <ProjectCardButtons project={project} noVideo={true} />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default ProjectOffcanvas;
