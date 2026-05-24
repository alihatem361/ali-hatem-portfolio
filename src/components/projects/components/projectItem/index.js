"use client";

import { BiGlobe } from "react-icons/bi";
import { FaDownload, FaYoutube } from "react-icons/fa";
import { FaAnglesRight, FaGithub, FaGooglePlay } from "react-icons/fa6";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Link from "next/link";
import { createSlug, resolvePublicAssetPath } from "../../../../helpers";
import "./style.css";

const PojectItem = ({ project }) => {
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

  // Generate project URL slug — always use English title so the URL is
  // language-agnostic and doesn't change when the user switches language.
  const projectSlug = createSlug(project.titleEn || project.title || "");
  const projectDetailsHref = `/projects/${projectSlug}`;

  return (
    <div className="card" data-aos="fade-up">
      <Link
        href={projectDetailsHref}
        className="project-image-link"
        aria-label={`Open ${project.title || "project"} details`}
      >
        <div className="img-container">
          <LazyLoadImage
            src={resolvePublicAssetPath(project.imeg)}
            alt={project.title}
            effect="blur"
            className="card-img-top"
            placeholderSrc={resolvePublicAssetPath(project.imeg)}
          />
        </div>
      </Link>
      <div className="card-body">
        <h5 className="card-title">
          <Link href={projectDetailsHref} className="project-title-link">
            {project.title} <FaAnglesRight className="title-arrow" />
          </Link>
        </h5>

        <p className="card-description">{truncateText(project.description)}</p>

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
  );
};

export default PojectItem;
