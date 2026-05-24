"use client";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FaRegEye } from "react-icons/fa";
import "./style.css";

/**
 * Converts any PDF URL into an embeddable src.
 * - Sanity CDN / direct PDF links → Google Docs Viewer (reliable cross-browser)
 * - Google Drive share links     → /preview format
 * - Everything else               → passed through as-is
 */
function toEmbedSrc(url) {
  if (!url) return "";

  // Google Drive share URL → replace with /preview
  const driveMatch = url.match(
    /https:\/\/drive\.google\.com\/file\/d\/([^/]+)/,
  );
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // Everything else (Sanity CDN, local paths, etc.) → Google Docs viewer
  return `https://docs.google.com/viewer?url=${encodeURIComponent(
    url.startsWith("/") ? window.location.origin + url : url,
  )}&embedded=true`;
}

function PreviewCvModal({ label = "Preview CV", cvUrl = "" }) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setShow(false);
    setIsLoading(true);
    setError(null);
  };

  const handleShow = () => setShow(true);

  const handleIframeLoad = () => setIsLoading(false);
  const handleIframeError = () => {
    setError("عفواً، حصل مشكلة في تحميل ال CV. برجاء المحاولة تاني");
    setIsLoading(false);
  };

  return (
    <div className="login__modal">
      <button
        className="login__modal__btn cv-action-btn cv-preview-btn"
        onClick={handleShow}
      >
        <FaRegEye className="cv-btn-icon" />
        <span>{label}</span>
      </button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="modal__header_text">CV Preview</Modal.Title>
        </Modal.Header>

        <Modal.Body className="login__modal__container">
          {isLoading && <div className="loading-spinner">جاري التحميل...</div>}
          {error && <div className="error-message">{error}</div>}

          {show && (
            <iframe
              src={toEmbedSrc(cvUrl)}
              allow="autoplay"
              width="100%"
              height="100%"
              allowFullScreen
              title="pdf cv"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PreviewCvModal;
