import React, { useState } from "react";
import { FaRocket, FaGithub, FaGlobe, FaPlay, FaImage } from "react-icons/fa";
import "./style.css";

function Gproject({ gproject }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  console.log("GProject Data:", gproject);
  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!gproject) return null;

  const { title, video, description, github, demo, codeStatus } = gproject;

  const renderButton = (link, text, icon) => {
    if (!link) return null;

    return (
      <a
        className={
          text === "GitHub" && codeStatus === "PRIVATE" ? "btn disabled" : "btn"
        }
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        <span>{text}</span> {icon}
      </a>
    );
  };

  return (
    <div className="gproject_card_container" data-aos="fade-up">
      <div className="gproject_card">
        <h3 data-aos="fade-right" data-aos-delay="200">
          {title || ""}
          <FaRocket className="mx-2" />
        </h3>
        <div className="gproject_card_body">
          {video ? (
            <div
              className="gproject_card_video"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <iframe
                src={`https://www.youtube.com/embed/${getVideoId(video)}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
                width="100%"
                height="315"
              />
            </div>
          ) : (
            <div
              className="gproject_card_image"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              {!imageLoaded && !imageError && (
                <div className="image-loader">
                  <div className="loader-spinner"></div>
                </div>
              )}
              <img
                src={
                  gproject.image ||
                  "https://via.placeholder.com/400x250/007bff/ffffff?text=Project+Image"
                }
                className="rounded-img"
                alt={title || "Project Image"}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{
                  display: imageLoaded || imageError ? "block" : "none",
                }}
              />
              {imageError && (
                <div className="image-error">
                  <FaImage />
                  <span>Image not available</span>
                </div>
              )}
            </div>
          )}
          <div
            className="gproject_card_content"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <p>{description || "No description available"}</p>
            <div
              className="card-buttons w-100 justify-content-start gap-5"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              {renderButton(github, "GitHub", <FaGithub className="mx-2" />)}
              {renderButton(demo, "Demo", <FaGlobe className="mx-2" />)}
              {renderButton(video, "Video", <FaPlay className="mx-2" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gproject;
