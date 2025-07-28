import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

function PreviewCvModal() {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleClose = () => {
    setShow(false);
    setIsLoading(true);
    setError(null);
  };

  const handleShow = () => setShow(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError(t("cv.error"));
    setIsLoading(false);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Force iframe reload by changing its key
    const iframe = document.querySelector(".cv-iframe");
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = "";
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  };

  const handleDownload = () => {
    // Create a link to download the CV directly
    const link = document.createElement("a");
    link.href = "/assets/Ali_Hatem_Ramadan_Resume.pdf";
    link.download = "Ali_Hatem_Ramadan_Resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cv__modal">
      <button className="cv__modal__btn" onClick={handleShow}>
        <span>{t("cv.previewButton")}</span>
        <i className="fas fa-eye"></i>
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className="cv-modal-wrapper"
        backdrop="static"
      >
        <Modal.Header closeButton className="cv-modal-header">
          <Modal.Title className="cv-modal-title">
            <i className="fas fa-file-pdf cv-title-icon"></i>
            {t("cv.modalTitle")}
          </Modal.Title>
          <Button
            variant="outline-light"
            size="sm"
            className="download-btn"
            onClick={handleDownload}
          >
            <i className="fas fa-download"></i>
            {t("cv.downloadButton")}
          </Button>
        </Modal.Header>

        <Modal.Body className="cv__modal__container">
          {isLoading && (
            <div className="cv-loading-container">
              <div className="cv-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <p className="loading-text">{t("cv.loading")}</p>
            </div>
          )}

          {error && (
            <div className="cv-error-container">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h4 className="error-title">Oops!</h4>
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <Button
                  variant="outline-warning"
                  onClick={handleRetry}
                  className="retry-btn"
                >
                  <i className="fas fa-redo"></i>
                  {t("cv.retry")}
                </Button>
                <Button
                  variant="outline-light"
                  onClick={handleDownload}
                  className="download-fallback-btn"
                >
                  <i className="fas fa-download"></i>
                  {t("cv.downloadButton")}
                </Button>
              </div>
            </div>
          )}

          <iframe
            src="https://drive.google.com/file/d/17OHpoQE-SmeLgNI30T1mA1pjvBS-ATdm/preview"
            allow="autoplay"
            width="100%"
            height="100%"
            allowFullScreen
            title="CV Preview"
            className="cv-iframe"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: isLoading || error ? "none" : "block" }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PreviewCvModal;
