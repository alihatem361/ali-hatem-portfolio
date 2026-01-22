import React, { Fragment, useState } from "react";
import "./style.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { FaAnglesRight, FaAnglesLeft, FaEye } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
// components
import ProjectCardButtons from "../ProjectCardButtons";
// helpers
import { createSlug } from "../../../../helpers";

const PojectItem = ({ project }) => {
  const { i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Fragment>
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
              <Link
                to={`/project/${createSlug(project.title)}`}
                className="view-details-btn"
                aria-label="View project details"
              >
                <FaEye />
                <span>View Details</span>
              </Link>
            </div>
          </div>
          <LazyLoadImage
            src={project.image}
            alt={project.title}
            className="project-image"
            placeholderSrc={project.image}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="card-content">
          <div className="card-header">
            <Link
              to={`/project/${createSlug(project.title)}`}
              className="project-title-link"
            >
              <h3 className="project-title">
                {project.title}
                {i18n.language === "ar" ? (
                  <FaAnglesLeft className="title-icon" />
                ) : (
                  <FaAnglesRight className="title-icon" />
                )}
              </h3>
            </Link>
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
