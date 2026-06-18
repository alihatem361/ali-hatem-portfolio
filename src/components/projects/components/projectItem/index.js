"use client";

import { BiGlobe } from "react-icons/bi";
import { FaApple, FaDownload, FaYoutube } from "react-icons/fa";
import { FaAnglesRight, FaGithub, FaGooglePlay } from "react-icons/fa6";
import { SiLoom } from "react-icons/si";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSlug, resolvePublicAssetPath } from "../../../../helpers";
import "./style.css";

const PojectItem = ({ project }) => {
  const router = useRouter();
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

  const normalizeLink = (value) =>
    typeof value === "string" ? value.trim() : "";

  const isYouTubeLink = (value) =>
    Boolean(value) && /youtu\.be|youtube\.com/i.test(value);

  const isGooglePlayLink = (value) =>
    Boolean(value) && value.includes("play.google.com");

  const isApkLink = (value) =>
    Boolean(value) && value.toLowerCase().includes(".apk");

  const buildActionItems = () => {
    const items = [];
    const seen = new Set();

    const demoLink = normalizeLink(project.demo);
    const androidLink = normalizeLink(project.android);
    const iosLink = normalizeLink(project.ios);
    const githubLink = normalizeLink(project.github);
    const videoLink = normalizeLink(project.video);
    const loomLink = normalizeLink(project.loomVideo);
    const videoKey = normalizeLink(project.videoKey);

    const demoIsGooglePlay = isGooglePlayLink(demoLink);
    const demoIsApk = isApkLink(demoLink);
    const demoIsStore = demoIsGooglePlay || demoIsApk;
    const demoIsYoutube = isYouTubeLink(demoLink);

    const googlePlayLink = androidLink || (demoIsGooglePlay ? demoLink : "");
    const apkLink = demoIsApk ? demoLink : "";
    const normalDemoLink = !demoIsStore && !demoIsYoutube ? demoLink : "";

    const youtubeLink =
      videoLink ||
      (videoKey ? `https://youtu.be/${videoKey}` : "") ||
      (demoIsYoutube ? demoLink : "");

    const pushItem = (key, href, icon, label) => {
      if (!href) return;
      const normalized = href.trim();
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      items.push({ key, href: normalized, icon, label });
    };

    pushItem(
      "googlePlay",
      googlePlayLink,
      <FaGooglePlay className="action-icon" />,
      "Google Play",
    );

    pushItem(
      "appStore",
      iosLink,
      <FaApple className="action-icon" />,
      "App Store",
    );

    pushItem(
      "demo",
      normalDemoLink,
      <BiGlobe className="action-icon" />,
      "Demo",
    );

    pushItem(
      "apk",
      apkLink,
      <FaDownload className="action-icon" />,
      "Download APK",
    );

    if (youtubeLink) {
      const label = isYouTubeLink(youtubeLink) ? "YouTube" : "Video";
      pushItem(
        "video",
        youtubeLink,
        <FaYoutube className="action-icon" />,
        label,
      );
    }

    pushItem("loom", loomLink, <SiLoom className="action-icon" />, "Loom");

    if (githubLink && project.codeStatus !== "PRIVATE") {
      pushItem(
        "github",
        githubLink,
        <FaGithub className="action-icon" />,
        "GitHub",
      );
    }

    return items;
  };

  const actionItems = buildActionItems();

  // Generate project URL slug — always use English title so the URL is
  // language-agnostic and doesn't change when the user switches language.
  const projectSlug = createSlug(project.titleEn || project.title || "");
  const projectDetailsHref = `/projects/${projectSlug}`;

  const handleCardClick = (event) => {
    if (!projectDetailsHref) return;
    const target = event.target;
    if (target instanceof Element && target.closest("a, button")) {
      return;
    }
    router.push(projectDetailsHref);
  };

  const handleCardKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    router.push(projectDetailsHref);
  };

  return (
    <div
      className="card project-card"
      data-aos="fade-up"
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
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

        {actionItems.length > 0 && (
          <div className="card-actions" aria-label="Project links">
            {actionItems.map((action) => (
              <a
                key={action.key}
                className="card-action-button"
                href={action.href}
                target="_blank"
                rel="noreferrer"
                aria-label={action.label}
              >
                {action.icon}
                <span>{action.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PojectItem;
