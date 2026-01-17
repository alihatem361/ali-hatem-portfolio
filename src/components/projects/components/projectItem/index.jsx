import React, { Fragment, useState } from "react";
import "./style.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProjectDetailsModal from "../ProjectDetailsModal";
import { FaAnglesRight, FaEye } from "react-icons/fa6";
// components
import ProjectCardButtons from "../ProjectCardButtons";

const PojectItem = ({ project }) => {
  const [show, setShow] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClose = () => setShow(false);

  const handleViewDetails = () => {
    setShow(true);
    setProjectData(project);
  };

  return (
    <Fragment>
      <ProjectDetailsModal
        project={projectData}
        show={show}
        handleClose={handleClose}
      />
      <div
        className={`project-card ${isHovered ? "hovered" : ""} ${
          imageLoaded ? "loaded" : ""
        }`}
        data-aos="fade-up"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-image-wrapper">
          <div className="image-overlay">
            <div className="overlay-content">
              <button
                className="view-details-btn"
                onClick={handleViewDetails}
                aria-label="View project details"
              >
                <FaEye />
                <span>View Details</span>
              </button>
            </div>
          </div>
          <LazyLoadImage
            src={project.imeg}
            alt={project.title}
            className="project-image"
            placeholderSrc={project.imeg}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="card-content">
          <div className="card-header">
            <h3 className="project-title" onClick={handleViewDetails}>
              {project.title}
              <FaAnglesRight className="title-icon" />
            </h3>
          </div>

          <p className="project-description">
            {project.description?.length > 120
              ? `${project.description.substring(0, 120)}...`
              : project.description}
          </p>

          <div className="tech-badges">
            {project.technology?.slice(0, 3).map((tech, index) => (
              <span key={index} className="tech-badge">
                {tech}
              </span>
            ))}
            {project.technology?.length > 3 && (
              <span className="tech-badge more">
                +{project.technology.length - 3}
              </span>
            )}
          </div>

          <div className="card-footer">
            <ProjectCardButtons project={project} />
          </div>
        </div>

        <div className="card-glow"></div>
      </div>
    </Fragment>
  );
};

export default PojectItem;
