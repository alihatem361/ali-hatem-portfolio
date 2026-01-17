import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./VideoPopup.css";

import YoutubeVideo from "./YoutubeVideo";
import LoomVideo from "./LoomVideo";
import { SiLoom } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsPlayCircle } from "react-icons/bs";

function VideoPopup({ videoKey, project }) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
  };

  const handleShow = () => {
    setIsLoading(true);
    setShow(true);
    // Simulate loading time for video
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <>
      <button
        className="video-trigger-btn"
        onClick={handleShow}
        aria-label={`Watch ${project.loomVideo ? "Loom" : "YouTube"} video`}
      >
        <div className="video-icon-wrapper">
          {project.loomVideo ? (
            <SiLoom className="video-icon loom-icon" />
          ) : (
            <FaYoutube className="video-icon youtube-icon" />
          )}
          <div className="play-overlay">
            <BsPlayCircle className="play-icon" />
          </div>
        </div>
        <span className="video-btn-text">
          {project.loomVideo ? "Watch Demo" : "Watch Video"}
        </span>
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        fullscreen="true"
        size="lg"
        className="video-modal-modern"
        backdrop="static"
        keyboard={true}
      >
        <div className="modal-backdrop-blur" />

        <div className="video-modal-header">
          <div className="video-modal-title">
            <div className="video-platform-badge">
              {project.loomVideo ? (
                <>
                  <SiLoom className="platform-icon" />
                  <span>Loom Demo</span>
                </>
              ) : (
                <>
                  <FaYoutube className="platform-icon" />
                  <span>YouTube Video</span>
                </>
              )}
            </div>
          </div>

          <button
            className="video-close-btn"
            onClick={handleClose}
            aria-label="Close video"
          >
            <IoClose className="close-icon" />
          </button>
        </div>

        <div className="video-modal-body">
          {isLoading ? (
            <div className="video-loading-container">
              <div className="video-loading-spinner"></div>
              <p className="loading-text">Loading video...</p>
            </div>
          ) : (
            <div className="video-container">
              {project.loomVideo ? (
                <LoomVideo videoUrl={project.loomVideo} />
              ) : (
                <YoutubeVideo project={project} />
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default VideoPopup;
