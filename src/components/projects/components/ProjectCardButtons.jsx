import React from "react";
import VideoPopup from "./VideoPopup";
import { FaGithub } from "react-icons/fa";
import { BiGlobe } from "react-icons/bi";
import { getProjectSlug } from "../../../helpers";
import { track } from "../../../helpers/analytics";

const ProjectCardButtons = ({ project, noVideo, placement = "card" }) => {
  const trackLink = (linkType) => () =>
    track("project_link_click", {
      link_type: linkType,
      project_slug: getProjectSlug(project),
      placement,
    });

  return (
    <div className="card-buttons enhanced-buttons">
      {project.github && project.github !== "" && (
        <a
          className="btn enhanced-btn github-btn"
          href={project.codeStatus === "PRIVATE" ? null : project.github}
          target="_blank"
          rel="noreferrer"
          onClick={
            project.codeStatus === "PRIVATE" ? undefined : trackLink("github")
          }
          title={
            project.codeStatus === "PRIVATE"
              ? "Private Repository"
              : "View Source Code"
          }
          style={{
            pointerEvents: project.codeStatus === "PRIVATE" ? "none" : "auto",
            opacity: project.codeStatus === "PRIVATE" ? 0.5 : 1,
          }}
        >
          <FaGithub />
          <span className="btn-text">Code</span>
        </a>
      )}

      {project.demo && project.demo !== "" && (
        <a
          className="btn enhanced-btn demo-btn"
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          title="View Live Demo"
          onClick={trackLink("demo")}
        >
          <BiGlobe />
          <span className="btn-text">Demo</span>
        </a>
      )}

      {!noVideo && project.video && project.video !== "" && (
        <VideoPopup videoKey={project.videoKey} project={project} />
      )}

      {!noVideo && project.loomVideo && project.loomVideo !== "" && (
        <VideoPopup videoKey={project.videoKey} project={project} />
      )}
    </div>
  );
};

export default ProjectCardButtons;
