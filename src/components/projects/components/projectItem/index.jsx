import React, { Fragment, useState } from "react";
import "./style.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useNavigate } from "react-router-dom";
import {
  FaAnglesRight,
  FaAnglesLeft,
  FaEye,
  FaLayerGroup,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";
// components
import ProjectCardButtons from "../ProjectCardButtons";
// helpers
import { getProjectSlug, sanityImage } from "../../../../helpers";
import { track } from "../../../../helpers/analytics";

const PojectItem = ({ project, onCollectionClick, placement = "grid" }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isCollection = project.type === "collection";
  const collectionUrl = isCollection
    ? `/collection/${project.collectionId}`
    : null;

  const trackSelect = () =>
    track("select_content", {
      content_type: isCollection ? "collection" : "project",
      item_id: isCollection ? project.collectionId : getProjectSlug(project),
      placement,
    });

  // Links inside a collection card: stop the card's own click handler from
  // tracking (and navigating) a second time.
  const handleCollectionLinkClick = (e) => {
    e.stopPropagation();
    trackSelect();
  };

  // Handle click for collection cards - navigate to collection page
  const handleCardClick = (e) => {
    if (isCollection) {
      trackSelect();
      e.preventDefault();
      navigate(collectionUrl);
    }
  };

  return (
    <Fragment>
      <div
        className={`project-card ${isHovered ? "hovered" : ""} ${
          imageLoaded ? "loaded" : ""
        } ${isCollection ? "collection-card" : ""}`}
        data-aos="fade-up"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={isCollection ? handleCardClick : undefined}
        style={{ cursor: isCollection ? "pointer" : "default" }}
      >
        {/* Stacked Card Effect for Collections */}
        {isCollection && (
          <>
            <div className="stacked-layer stacked-layer-1"></div>
            <div className="stacked-layer stacked-layer-2"></div>
          </>
        )}

        {/* Collection Badge */}
        {isCollection && (
          <div className="collection-badge-wrapper">
            <div className="collection-count-badge">
              <FaLayerGroup />
              <span>
                {project.subProjects?.length} {t("Projects")}
              </span>
            </div>
          </div>
        )}

        <div className="card-image-wrapper">
          <div className="image-overlay">
            <div className="overlay-content">
              {isCollection ? (
                <Link
                  to={collectionUrl}
                  className="view-details-btn"
                  onClick={handleCollectionLinkClick}
                  aria-label="View collection"
                >
                  <FaLayerGroup />
                  <span>{t("View Collection")}</span>
                </Link>
              ) : (
                <Link
                  to={`/project/${getProjectSlug(project)}`}
                  className="view-details-btn"
                  onClick={trackSelect}
                  aria-label="View project details"
                >
                  <FaEye />
                  <span>View Details</span>
                </Link>
              )}
            </div>
          </div>
          <LazyLoadImage
            src={sanityImage(project.image, { width: 720 })}
            alt={project.title}
            className="project-image"
            placeholderSrc={sanityImage(project.image, { width: 40, quality: 30 })}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="card-content">
          <div className="card-header">
            {isCollection ? (
              <Link
                to={collectionUrl}
                className="project-title-link"
                onClick={handleCollectionLinkClick}
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
            ) : (
              <Link
                to={`/project/${getProjectSlug(project)}`}
                className="project-title-link"
                onClick={trackSelect}
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
            )}
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
            {isCollection ? (
              <Link
                to={collectionUrl}
                className="view-collection-btn"
                onClick={handleCollectionLinkClick}
              >
                <FaLayerGroup />
                <span>{t("Browse Collection")}</span>
              </Link>
            ) : (
              <ProjectCardButtons project={project} placement={placement} />
            )}
          </div>
        </div>

        <div className="card-glow"></div>
      </div>
    </Fragment>
  );
};

export default PojectItem;
