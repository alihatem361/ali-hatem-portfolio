import React, { Fragment } from "react";
import "./style.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProjectOffcanvas from "../ProjectOffcanvas";
import { FaAnglesRight, FaGooglePlay, FaGithub } from "react-icons/fa6";
import { BiGlobe } from "react-icons/bi";
import { FaYoutube, FaDownload } from "react-icons/fa";

const PojectItem = ({ project }) => {
  const [show, setShow] = React.useState(false);
  const [projectData, setProjectData] = React.useState({});
  const handleClose = () => setShow(false);

  // Truncate description to ~100 characters
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Get first 3 technologies and count remaining
  const displayTechnologies = project.technology?.slice(0, 3) || [];
  const remainingCount = (project.technology?.length || 0) - 3;

  // Check if demo is Google Play link
  const isGooglePlayLink = project.demo?.includes("play.google.com");
  // Check if demo is APK download
  const isApkDownload = project.demo?.includes(".apk");
  // Check if has video
  const hasVideo = project.video || project.videoKey;
  // Check if has github
  const hasGithub = project.github && project.github !== "";

  // Determine which button to show (priority: demo > video > github)
  const getButtonInfo = () => {
    if (project.demo) {
      if (isGooglePlayLink) {
        return {
          href: project.demo,
          icon: <FaGooglePlay className="demo-icon" />,
          text: "Google Play",
        };
      } else if (isApkDownload) {
        return {
          href: project.demo,
          icon: <FaDownload className="demo-icon" />,
          text: "Download APK",
        };
      } else {
        return {
          href: project.demo,
          icon: <BiGlobe className="demo-icon" />,
          text: "Demo",
        };
      }
    } else if (hasVideo) {
      const videoUrl = project.video || `https://youtu.be/${project.videoKey}`;
      return {
        href: videoUrl,
        icon: <FaYoutube className="demo-icon" />,
        text: "Watch Video",
      };
    } else if (hasGithub) {
      return {
        href: project.github,
        icon: <FaGithub className="demo-icon" />,
        text: "GitHub",
      };
    }
    return null;
  };

  const buttonInfo = getButtonInfo();

  return (
    <Fragment>
      <ProjectOffcanvas
        project={projectData}
        show={show}
        handleClose={handleClose}
      />
      <div className="card" data-aos="fade-up">
        <div className="img-container">
          <LazyLoadImage
            src={project.imeg}
            alt={project.title}
            effect="blur"
            className="card-img-top"
            placeholderSrc={project.imeg}
            onClick={() => {
              setShow(true);
              setProjectData(project);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="card-body">
          <h5
            className="card-title"
            onClick={() => {
              setShow(true);
              setProjectData(project);
            }}
            style={{ cursor: "pointer" }}
          >
            {project.title} <FaAnglesRight className="title-arrow" />
          </h5>

          <p className="card-description">
            {truncateText(project.description)}
          </p>

          <div className="tech-tags">
            {displayTechnologies.map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="tech-tag tech-tag-more">+{remainingCount}</span>
            )}
          </div>

          {buttonInfo && (
            <a
              className="demo-button"
              href={buttonInfo.href}
              target="_blank"
              rel="noreferrer"
            >
              {buttonInfo.icon}
              <span>{buttonInfo.text}</span>
            </a>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default PojectItem;
