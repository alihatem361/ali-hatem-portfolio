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
  const { t, i18n } = useTranslation();
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
          width: "60%", // Increased width from default
          maxWidth: "800px", // Added max width for very large screens
        }}
        className="text-capitalize custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          {" "}
          <h1 className="text-capitalize" style={{ fontSize: "2.5rem" }}>
            {project.title ? project.title : ""}
          </h1>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4">
          <div className="img-container w-100">
            {project.loomVideo ? (
              <LoomVideo videoUrl={project.loomVideo} />
            ) : null}
            <YoutubeVideo project={project} />
            {project.videoKey || project.loomVideo ? null : (
              <LazyLoadImage
                src={project.imeg ? project.imeg : ""}
                alt={project.title ? project.title : ""}
                effect="blur"
                className="card-img-top w-100"
                placeholderSrc={project.imeg ? project.imeg : ""}
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h2
              className="card-title text-capitalize"
              style={{ fontSize: "2.2rem" }}
            >
              all technology used{" "}
              <PiShootingStarBold className="text-warning" />
            </h2>

            {project.codeStatus === "PRIVATE" ? (
              <span
                className=" rounded text-center"
                style={{
                  fontSize: "1.4rem",
                  backgroundColor: "var(--danger-color)",
                  boxShadow: "0 0 5px var(--danger-color)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                {project.codeStatus === "PRIVATE"
                  ? i18n.language === "en"
                    ? "code is private"
                    : "الكود خاص"
                  : null}

                <FaLock className="ms-2" />
              </span>
            ) : null}
          </div>{" "}          <div className="card-text d-flex justify-content-start flex-wrap gap-3 mt-4">
            {project.technology &&
              project.technology.map((tech, index) => {
                return (
                  <h5 key={index}>
                    <span
                      className="badge"
                      style={{
                        color: "white",
                        borderRadius: "15px",
                        outline: "none",
                        padding: "10px 15px",
                        fontSize: "1.3rem",
                        backgroundColor: "var(--tertiary-color)",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.05)"
                      }}
                    >
                      # {tech}
                    </span>
                  </h5>
                );
              })}
          </div>
          <h3
            className="card-title text-capitalize my-4"
            style={{ fontSize: "1.8rem" }}
          >
            description <IoRocket className="text-warning" />
          </h3>          <p
            className="card-text"
            style={{
              color: "white",
              fontSize: "1.4rem",
              fontWeight: "400",
              lineHeight: "1.8",
              marginBottom: "2rem",
              padding: "0.5rem",
              borderLeft: "3px solid var(--warning-color)",
              paddingLeft: "1rem",
            }}
          >
            {project.description ? project.description : "no description"}
          </p>
          <ProjectCardButtons project={project} noVideo={true} />
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default ProjectOffcanvas;
